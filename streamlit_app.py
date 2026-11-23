import os
import shutil
import subprocess
from pathlib import Path
from typing import Any

import streamlit as st
import streamlit.components.v1 as components

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"
STREAMLIT_STATIC_DIR = BASE_DIR / "streamlit_static"

st.set_page_config(
    page_title="PhysicsKit — Understand Physics. See It. Explore It.",
    page_icon="⚛️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Trim outer Streamlit chrome padding so the interactive PhysicsKit workspace fills the viewport cleanly.
st.markdown(
    """
    <style>
      .block-container {
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
        max-width: 100% !important;
      }
      header[data-testid="stHeader"] {
        background: transparent;
      }
      iframe {
        border: none !important;
      }
    </style>
    """,
    unsafe_allow_html=True,
)


def _get_secret(key: str, default: str = "") -> str:
    try:
        if key in st.secrets:
            val = str(st.secrets[key]).strip()
            if val:
                return val
    except Exception:
        pass
    return os.environ.get(key, default).strip()


def _build_tutor_system_instruction(context: dict[str, Any]) -> str:
    subject = str(context.get("subject") or "Classical Mechanics")
    chapter = str(context.get("chapter") or "Vectors")
    topic = str(context.get("topic") or "General Vectors")
    level = str(context.get("level") or "intermediate")
    hint_first = bool(context.get("hintFirst", True))

    if level == "beginner":
        level_guidance = (
            "Use intuitive everyday analogies, plain geometric language, and explicit "
            "step-by-step arithmetic before introducing formal notation."
        )
    elif level == "advanced":
        level_guidance = (
            "Use rigorous vector algebra, formal coordinate notation, unit vector basis "
            "representations, and concise mathematical derivations."
        )
    else:
        level_guidance = (
            "Balance physical intuition with clear mathematical formulation, showing "
            "intermediate algebraic steps and units."
        )

    pedagogy_guidance = (
        "When the student asks to solve a problem or asks what the answer is, guide them "
        "with a targeted Socratic hint and the first setup step first, asking them to check "
        "or try the next step—unless they explicitly ask for the full worked solution or are "
        "checking an answer."
        if hint_first
        else "Provide a complete, clear step-by-step derivation and physical explanation while highlighting common pitfalls."
    )

    return "\n".join(
        [
            "You are the PhysicsKit AI Physics Tutor, a rigorous, encouraging physics educator.",
            f"Active learning context -> Subject: {subject} | Chapter: {chapter} | Topic: {topic}.",
            f'Prioritize concepts, equations, and intuition directly relevant to "{topic}" in "{chapter}" unless the student explicitly changes subjects.',
            f"Target learner level: {level}. {level_guidance}",
            pedagogy_guidance,
            "Formatting rules:",
            "- Format inline mathematics with single dollar signs like $A_x = A \\cos\\theta$ and display equations with double dollar signs like $$R = \\sqrt{R_x^2 + R_y^2}$$.",
            "- Always explain the physical meaning of equations alongside the algebra.",
            "- If the student shares an incorrect answer, pinpoint the exact conceptual or sign/trigonometry mistake kindly and explain why it happened.",
            "- Keep responses well-structured with short paragraphs and numbered steps.",
        ]
    )


def _handle_tutor_request(payload: dict[str, Any]) -> dict[str, Any]:
    request_id = str(payload.get("requestId") or "")
    message = str(payload.get("message") or "").strip()
    if not message:
        return {
            "requestId": request_id,
            "error": "Please enter a physics question before sending.",
        }

    api_key = _get_secret("GEMINI_API_KEY")
    if not api_key or api_key == "MY_GEMINI_API_KEY":
        return {
            "requestId": request_id,
            "error": (
                "AI Physics Tutor is not configured yet because GEMINI_API_KEY is missing. "
                "Add GEMINI_API_KEY in Streamlit App Settings > Secrets."
            ),
        }

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        return {
            "requestId": request_id,
            "error": "google-genai Python package is not installed. Ensure requirements.txt is installed.",
        }

    model_name = _get_secret("GEMINI_MODEL", "gemini-2.5-flash") or "gemini-2.5-flash"
    context = payload.get("context") if isinstance(payload.get("context"), dict) else {}
    raw_history = payload.get("history") if isinstance(payload.get("history"), list) else []

    contents: list[types.Content] = []
    for item in raw_history[-12:]:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        text = str(item.get("text") or "").strip()
        if role in ("user", "model") and text:
            contents.append(
                types.Content(role=role, parts=[types.Part.from_text(text=text)])
            )
    contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message)]))

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=model_name,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=_build_tutor_system_instruction(context)
            ),
        )
        reply = (response.text or "").strip()
        if not reply:
            return {
                "requestId": request_id,
                "error": "The AI tutor returned an empty response. Please try rephrasing your question.",
            }
        return {"requestId": request_id, "reply": reply}
    except Exception as exc:
        err_msg = str(exc)
        lower = err_msg.lower()
        if "api_key_invalid" in lower or "permission_denied" in lower or "403" in lower:
            return {
                "requestId": request_id,
                "error": "The configured GEMINI_API_KEY could not be authorized. Please verify it in Streamlit Secrets.",
            }
        if "resource_exhausted" in lower or "429" in lower:
            return {
                "requestId": request_id,
                "error": "AI tutor rate limit reached temporarily. Please wait a moment and try again.",
            }
        return {
            "requestId": request_id,
            "error": f"Unable to reach the AI Physics Tutor right now ({err_msg}).",
        }


TMP_ROOT = Path("/tmp")
TMP_NODE_DIR = TMP_ROOT / "physicskit_node"
TMP_BUILD_DIR = TMP_ROOT / "physicskit_build"
TMP_DIST_DIR = TMP_BUILD_DIR / "dist"
NODE_VERSION = "v22.14.0"


def _resolve_frontend_dir() -> Path | None:
    for candidate in (DIST_DIR, STREAMLIT_STATIC_DIR, TMP_DIST_DIR):
        if (candidate / "index.html").exists():
            return candidate
    return None


def _get_node_major(node_bin: str) -> int:
    try:
        out = subprocess.check_output([node_bin, "-v"], text=True, timeout=5).strip()
        return int(out.lstrip("v").split(".")[0])
    except Exception:
        return 0


def _ensure_node_and_npm() -> tuple[str, str]:
    sys_node = shutil.which("node")
    sys_npm = shutil.which("npm")
    if sys_node and sys_npm and _get_node_major(sys_node) >= 20:
        return sys_node, sys_npm

    import platform
    import tarfile
    import urllib.request

    machine = platform.machine().lower()
    if machine in ("x86_64", "amd64"):
        arch = "x64"
    elif machine in ("aarch64", "arm64"):
        arch = "arm64"
    else:
        raise RuntimeError(f"Unsupported architecture for automatic Node.js setup: {machine}")

    extracted_dir = TMP_NODE_DIR / f"node-{NODE_VERSION}-linux-{arch}"
    node_bin = extracted_dir / "bin" / "node"
    npm_bin = extracted_dir / "bin" / "npm"
    if node_bin.exists() and npm_bin.exists():
        return str(node_bin), str(npm_bin)

    TMP_NODE_DIR.mkdir(parents=True, exist_ok=True)
    tarball_name = f"node-{NODE_VERSION}-linux-{arch}.tar.gz"
    tarball_path = TMP_NODE_DIR / tarball_name
    url = f"https://nodejs.org/dist/{NODE_VERSION}/{tarball_name}"

    urllib.request.urlretrieve(url, tarball_path)
    try:
        with tarfile.open(tarball_path, "r:gz") as tf:
            tf.extractall(TMP_NODE_DIR)
    finally:
        if tarball_path.exists():
            tarball_path.unlink()

    if not node_bin.exists() or not npm_bin.exists():
        raise RuntimeError("Downloaded Node.js archive did not contain node/npm binaries.")
    return str(node_bin), str(npm_bin)


def _build_frontend_in_tmp() -> Path:
    import json

    node_bin, npm_bin = _ensure_node_and_npm()
    node_dir = str(Path(node_bin).parent)

    if TMP_BUILD_DIR.exists():
        shutil.rmtree(TMP_BUILD_DIR, ignore_errors=True)
    TMP_BUILD_DIR.mkdir(parents=True, exist_ok=True)

    for rel in ("index.html", "vite.config.ts", "tsconfig.json"):
        src_file = BASE_DIR / rel
        if src_file.exists():
            shutil.copy2(src_file, TMP_BUILD_DIR / rel)

    src_dir = BASE_DIR / "src"
    if not src_dir.exists():
        raise RuntimeError("Missing `src/` directory; cannot build PhysicsKit frontend.")
    shutil.copytree(src_dir, TMP_BUILD_DIR / "src")

    # Build a lean frontend-only package.json in /tmp so server-only deps aren't installed on Streamlit Cloud.
    source_pkg: dict[str, Any] = {}
    pkg_file = BASE_DIR / "package.json"
    if pkg_file.exists():
        source_pkg = json.loads(pkg_file.read_text(encoding="utf-8"))
    src_deps = {**source_pkg.get("dependencies", {}), **source_pkg.get("devDependencies", {})}

    frontend_deps = {
        name: src_deps[name]
        for name in (
            "react",
            "react-dom",
            "lucide-react",
            "three",
            "katex",
            "vite",
            "@vitejs/plugin-react",
            "@tailwindcss/vite",
            "tailwindcss",
            "@types/react",
            "@types/react-dom",
            "@types/three",
            "@types/katex",
        )
        if name in src_deps
    }
    lean_pkg = {
        "name": "physicskit-frontend",
        "private": True,
        "type": "module",
        "dependencies": frontend_deps,
    }
    (TMP_BUILD_DIR / "package.json").write_text(json.dumps(lean_pkg, indent=2), encoding="utf-8")

    env = os.environ.copy()
    env["PATH"] = f"{node_dir}{os.pathsep}{env.get('PATH', '')}"
    env["HOME"] = str(TMP_ROOT / "physicskit_home")
    env["npm_config_cache"] = str(TMP_ROOT / "physicskit_npm_cache")
    Path(env["HOME"]).mkdir(parents=True, exist_ok=True)
    Path(env["npm_config_cache"]).mkdir(parents=True, exist_ok=True)

    try:
        subprocess.run(
            [npm_bin, "install", "--no-audit", "--no-fund"],
            cwd=TMP_BUILD_DIR,
            env=env,
            check=True,
            capture_output=True,
            text=True,
        )
        vite_cli = TMP_BUILD_DIR / "node_modules" / "vite" / "bin" / "vite.js"
        subprocess.run(
            [node_bin, str(vite_cli), "build"],
            cwd=TMP_BUILD_DIR,
            env=env,
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or exc.stdout or str(exc)).strip()
        raise RuntimeError(f"Frontend build failed on Streamlit runtime:\n{detail[:800]}") from exc

    if not (TMP_DIST_DIR / "index.html").exists():
        raise RuntimeError("Vite build finished without creating dist/index.html.")
    return TMP_DIST_DIR


@st.cache_resource(show_spinner="Preparing PhysicsKit interactive frontend (first launch may take ~30s)...")
def get_physicskit_component():
    frontend_dir = _resolve_frontend_dir()
    if frontend_dir is None:
        frontend_dir = _build_frontend_in_tmp()

    return components.declare_component("physicskit", path=str(frontend_dir))


def main() -> None:
    try:
        physicskit_ui = get_physicskit_component()
    except Exception as exc:
        st.error(f"Could not initialize PhysicsKit frontend: {exc}")
        st.stop()

    if "last_tutor_request_id" not in st.session_state:
        st.session_state["last_tutor_request_id"] = None
    if "last_tutor_response" not in st.session_state:
        st.session_state["last_tutor_response"] = None

    event = physicskit_ui(
        tutor_response=st.session_state["last_tutor_response"],
        key="physicskit_main",
    )

    if isinstance(event, dict) and event.get("type") == "tutor_request":
        req_id = event.get("requestId")
        if req_id and req_id != st.session_state["last_tutor_request_id"]:
            st.session_state["last_tutor_request_id"] = req_id
            st.session_state["last_tutor_response"] = _handle_tutor_request(event)
            st.rerun()


if __name__ == "__main__":
    main()
