import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";

interface TutorHistoryItem {
  role: "user" | "model";
  text: string;
}

interface TutorRequestBody {
  message?: string;
  history?: TutorHistoryItem[];
  context?: {
    subject?: string;
    chapter?: string;
    topic?: string;
    level?: "beginner" | "intermediate" | "advanced";
    hintFirst?: boolean;
  };
}

function buildTutorSystemInstruction(context: TutorRequestBody["context"]): string {
  const subject = context?.subject || "Classical Mechanics";
  const chapter = context?.chapter || "Vectors";
  const topic = context?.topic || "General Vectors";
  const level = context?.level || "intermediate";
  const hintFirst = context?.hintFirst ?? true;

  const levelGuidance =
    level === "beginner"
      ? "Use intuitive everyday analogies, plain geometric language, and explicit step-by-step arithmetic before introducing formal notation."
      : level === "advanced"
        ? "Use rigorous vector algebra, formal coordinate notation, unit vector basis representations, and concise mathematical derivations."
        : "Balance physical intuition with clear mathematical formulation, showing intermediate algebraic steps and units.";

  const pedagogyGuidance = hintFirst
    ? "When the student asks to solve a problem or asks what the answer is, guide them with a targeted Socratic hint and the first setup step first, asking them to check or try the next step—unless they explicitly ask for the full worked solution or are checking an answer."
    : "Provide a complete, clear step-by-step derivation and physical explanation while highlighting common pitfalls.";

  return [
    "You are the PhysicsKit AI Physics Tutor, a rigorous, encouraging physics educator.",
    `Active learning context -> Subject: ${subject} | Chapter: ${chapter} | Topic: ${topic}.`,
    `Prioritize concepts, equations, and intuition directly relevant to "${topic}" in "${chapter}" unless the student explicitly changes subjects.`,
    `Target learner level: ${level}. ${levelGuidance}`,
    pedagogyGuidance,
    "Formatting rules:",
    "- Format inline mathematics with single dollar signs like $A_x = A \\cos\\theta$ and display equations with double dollar signs like $$R = \\sqrt{R_x^2 + R_y^2}$$.",
    "- Always explain the physical meaning of equations alongside the algebra.",
    "- If the student shares an incorrect answer, pinpoint the exact conceptual or sign/trigonometry mistake kindly and explain why it happened.",
    "- Keep responses well-structured with short paragraphs and numbered steps.",
  ].join("\n");
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0),
    });
  });

  app.post("/api/tutor", async (req, res) => {
    const body = (req.body || {}) as TutorRequestBody;
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      res.status(400).json({ error: "Please enter a physics question before sending." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      res.status(503).json({
        error:
          "AI Physics Tutor is not configured yet because GEMINI_API_KEY is missing. You can set GEMINI_API_KEY in the Settings > Secrets panel.",
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const history = Array.isArray(body.history)
        ? body.history
            .filter(
              (item): item is TutorHistoryItem =>
                Boolean(item) &&
                (item.role === "user" || item.role === "model") &&
                typeof item.text === "string" &&
                item.text.trim().length > 0,
            )
            .slice(-12)
        : [];

      const contents = [
        ...history.map((item) => ({
          role: item.role,
          parts: [{ text: item.text }],
        })),
        {
          role: "user" as const,
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents,
        config: {
          systemInstruction: buildTutorSystemInstruction(body.context),
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({
          error: "The AI tutor returned an empty response. Please try rephrasing your question.",
        });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unknown AI tutor error";
      console.error("[/api/tutor] Gemini API error:", errMsg);

      const lower = errMsg.toLowerCase();
      if (lower.includes("api_key_invalid") || lower.includes("permission_denied") || lower.includes("403")) {
        res.status(403).json({
          error:
            "The configured GEMINI_API_KEY could not be authorized. Please verify your API key in the Settings > Secrets panel.",
        });
        return;
      }
      if (lower.includes("resource_exhausted") || lower.includes("429")) {
        res.status(429).json({
          error: "AI tutor rate limit reached temporarily. Please wait a moment and try again.",
        });
        return;
      }

      res.status(500).json({
        error: `Unable to reach the AI Physics Tutor right now (${errMsg}).`,
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("/{*splat}", (_req, res) => {
      const indexPath = path.join(distDir, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Build not found. Run npm run build first.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PhysicsKit server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start PhysicsKit server:", err);
  process.exit(1);
});
