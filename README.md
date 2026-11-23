# PhysicsKit

**Understand Physics. See It. Explore It.**

PhysicsKit is an interactive physics learning and simulation platform built for students, educators, and self-learners. It combines conceptual lessons, KaTeX mathematical derivations, real-time 2D HTML5 Canvas and 3D Three.js WebGL simulations, practice exercises, and an AI-powered Physics Tutor.

---

## Features

- **Modular Curriculum Registry** (`src/content/registry.ts`): Hierarchical architecture (`Subject -> Learning Resource -> Chapter -> Topic -> Simulations / Equations / Exercises / Quizzes`) designed so new chapters and subjects can be added via data modules without redesigning the UI.
- **Classical Mechanics — Chapter 1: Vectors**:
  - 13 structured topics (*Introduction to Vectors* through *Applications of Vectors*), each with a **7-Stage Learning Mode** (Concept Introduction, Physical Interpretation, Mathematical Formulation, Visual Explanation, Worked Example, Embedded Simulation, and Check Your Understanding).
  - Persistent topic completion progress (`localStorage`).
- **Interactive Vector Lab (8 Simulations)**:
  1. **Vector Representation** (2D draggable tip, Cartesian & polar synchronization)
  2. **Vector Addition** (2D head-to-tail and parallelogram rules)
  3. **Vector Subtraction** (2D reversal $-\vec{B}$ and $\vec{A} + (-\vec{B})$)
  4. **Resolution of Vectors** (2D animated projections $A_x = A\cos\theta$, $A_y = A\sin\theta$)
  5. **Unit Vectors ($\hat{i}, \hat{j}, \hat{k}$)** (2D Canvas & 3D WebGL toggle with normalized direction vector)
  6. **Dot Product Explorer** (2D $\vec{A} \cdot \vec{B} = AB\cos\theta$, scalar projection shadow, alignment presets)
  7. **3D Cross Product & Right-Hand Rule** (Three.js WebGL with OrbitControls, spanned parallelogram area, and right-hand curl arc)
  8. **Position and Displacement** (2D draggable $\vec{r}_1$ and $\vec{r}_2$ with $\Delta\vec{r} = \vec{r}_2 - \vec{r}_1$)
- **Practice & Quizzes**: 12 questions across Easy, Medium, and Hard difficulties (multiple-choice, numerical with validation, conceptual, diagram interpretation, and true/false) with instant feedback and worked explanations.
- **AI Physics Tutor**: Topic-aware tutoring with configurable depth (*Beginner / Intermediate / Advanced*) and hint-first Socratic guidance, powered server-side by the Gemini API.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, KaTeX
- **Simulations**: HTML5 2D Canvas, Three.js (3D WebGL)
- **Node.js Server**: Express + `@google/genai` (`server.ts`)
- **Streamlit Wrapper**: `streamlit_app.py` + `google-genai` Python SDK

---

## Project Structure

```text
├── server.ts                          # Express + Vite server & /api/tutor endpoint
├── streamlit_app.py                   # Streamlit Cloud entrypoint & Gemini bridge
├── requirements.txt                   # Python dependencies for Streamlit
├── streamlit_static/                  # Prebuilt React/Vite production bundle for Streamlit Cloud
├── .streamlit/
│   ├── config.toml                    # Streamlit theme & server configuration
│   └── secrets.toml.example           # Example secrets template for Streamlit
├── src/
│   ├── content/                       # Extensible subject/chapter/topic/exercise registry
│   ├── components/                    # Reusable layout, KaTeX, SVG diagram & lab UI
│   ├── pages/                         # Home, Explore, Subject, Vectors Chapter, Practice, Tutor, About
│   ├── services/                      # Pure vector math & global search + unit tests
│   ├── simulations/vector/            # 2D Canvas, 3D Three.js, and Interactive Vector Lab
│   └── utils/streamlitBridge.ts       # Optional postMessage bridge when running inside Streamlit
└── vite.config.ts
```

---

## Local Development (Node.js)

### Prerequisites
- Node.js 20+
- A Gemini API key (optional—required only for the AI Physics Tutor)

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `GEMINI_API_KEY`.
3. Start the development server (runs on port `3000`):
   ```bash
   npm run dev
   ```
4. Run typecheck, unit tests, and production build:
   ```bash
   npm run lint
   npx tsx --test src/services/physics/vectorMath.test.ts src/services/search/globalSearch.test.ts
   npm run build
   ```

---

## Publishing on Streamlit Community Cloud

PhysicsKit includes everything required to deploy directly to **Streamlit Community Cloud** (`share.streamlit.io`):

- `streamlit_app.py` — Serves the prebuilt React/Vite bundle (`dist/` or `streamlit_static/`) via `st.components.v1.declare_component`, or automatically provisions Node.js 22 LTS and builds the frontend in `/tmp` on first launch if no prebuilt bundle is present. Also handles AI Physics Tutor queries securely in Python.
- `streamlit_static/` — Prebuilt frontend assets synced automatically by `npm run build` for instant startup when committed.
- `requirements.txt` — Installs `streamlit` and `google-genai`.
- `.streamlit/config.toml` — Applies PhysicsKit's light scientific theme and headless server defaults.

### Deployment Steps
1. Push this repository to GitHub.
2. Go to [share.streamlit.io](https://share.streamlit.io/) and click **New app**.
3. Select your repository, branch, and set **Main file path** to:
   ```text
   streamlit_app.py
   ```
4. Open **Advanced settings -> Secrets** and add your Gemini API key:
   ```toml
   GEMINI_API_KEY = "your-actual-gemini-api-key"
   GEMINI_MODEL = "gemini-2.5-flash"
   ```
5. Click **Deploy**. Streamlit Cloud installs `requirements.txt` and launches PhysicsKit automatically.

### Testing Streamlit Locally
```bash
npm install && npm run build
pip install -r requirements.txt
cp .streamlit/secrets.toml.example .streamlit/secrets.toml
# Edit .streamlit/secrets.toml with your GEMINI_API_KEY
streamlit run streamlit_app.py
```
