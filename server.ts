import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client to prevent crashing on boot if key is missing as per guidelines
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST APIs
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    time: new Date().toISOString(),
    aiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Endpoint: Generate dynamic personalized motivation/affirmation based on current focus areas and mood
app.post("/api/affirmation", async (req, res) => {
  const { mood, moodScore, focusGoal, name, struggles } = req.body;

  try {
    const ai = getGeminiClient();
    const prompt = `
      You are a warm, deeply empathetic, and certified therapeutic life coach helping an individual regain focus.
      User Details:
      - Name: ${name || "friend"}
      - Current State/Struggles: ${struggles || "feeling demotivated, lacking focus and energy"}
      - Mood description: ${mood || "neutral"} (Scale: ${moodScore || 5}/10)
      - Key Focus Goal: ${focusGoal || "starting with small manageable habits"}

      Generate a personalized daily affirmation and motivational guidance.
      Structure the response as a JSON object with:
      - affirmation (string): A powerful, compassionate, present-tense affirmation (1-2 sentences).
      - focusTip (string): One small, micro-step or manageable action the user can easily take in the next 10 minutes.
      - supportiveMessage (string): 2-3 warm, non-judgmental sentences of therapeutic encouragement.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["affirmation", "focusTip", "supportiveMessage"],
          properties: {
            affirmation: {
              type: Type.STRING,
              description: "Present tense affirmation focused on gentle empowerment.",
            },
            focusTip: {
              type: Type.STRING,
              description: "A super low-friction action (e.g. drinking a glass of water, stretching)."
            },
            supportiveMessage: {
              type: Type.STRING,
              description: "Empathetic mentoring prose validating their struggle."
            }
          }
        }
      }
    });

    const dataText = response.text;
    res.json(JSON.parse(dataText || "{}"));
  } catch (error: any) {
    console.error("Gemini affirmation generation error:", error);
    
    // Graceful fallback templates if API key is not configured or fails
    const fallbackAffirmations = [
      {
        affirmation: "I am allowed to move slowly. My worth is not defined by my productivity, but by my presence.",
        focusTip: "Place both feet flat on the floor, close your eyes, and take three warm, deep breaths.",
        supportiveMessage: "It is entirely natural to feel overwhelmed or frozen. You don't have to climb the entire mountain today; just focus on the next step right in front of you."
      },
      {
        affirmation: "I honor where I am right now. Even tiny progress is progress, and I am rebuilding my strength step by step.",
        focusTip: "Clear off just three objects from your immediate desk area or table to create physical breathing room.",
        supportiveMessage: "Be extra kind to yourself. When energy is low, meeting yourself with patience rather than pressure helps clarity bloom."
      },
      {
        affirmation: "I set boundaries for my peace. I focus on small, simple habits that nourish my energy.",
        focusTip: "Stand up, gently stretch your arms above your head for 15 seconds, and take a sip of fresh water.",
        supportiveMessage: "A demotivated mind is often an exhausted mind. Treat yourself like a friend who is recovering. Every small positive loop builds stability."
      }
    ];

    const randomIndex = Math.floor(Math.random() * fallbackAffirmations.length);
    res.json({
      ...fallbackAffirmations[randomIndex],
      isFallback: true,
      errorInfo: error instanceof Error ? error.message : String(error)
    });
  }
});

// Endpoint: Analyze journal for professional emotional reflection based on CBT (Cognitive Behavioral Therapy)
app.post("/api/journal/analyze", async (req, res) => {
  const { mood, moodScore, entryText } = req.body;

  if (!entryText || entryText.trim().length === 0) {
    return res.status(400).json({ error: "Journal text is required for analysis." });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `
      You are a compassionate, skilled CBT (Cognitive Behavioral Therapy) counsellor reviewing a user's reflective journal entry.
      Analyze the text with extreme warmth, professional respect, and non-judgmental support.

      User Entry Info:
      - Current state of mood: ${mood || "unspecified"} (Self-assessed Score: ${moodScore || 5}/10)
      - Journal text: "${entryText}"

      Please evaluate:
      1. Cognitive Distortions: Identify if there are signs of distortions such as "All-or-Nothing thinking", "Catastrophizing", "Emotional Reasoning", or "Mind Reading" in a kind, clinical but simple educational manner. If none or subtle, emphasize self-compassion.
      2. Reframing Guidance: Provide a gentle, warm perspective shift on how to reframe their thoughts with kinder alternatives.
      3. Practical Coping Exercises: Offer 2 actionable mindfulness/cognitive exercises (e.g., 5-4-3-2-1 grounding, thought records).

      Format the response strictly as a JSON object with:
      - analysisText (string): 2-3 warm sentences summarizing your observation, validating their feeling.
      - identifiedDistortions (array of strings): Lists any positive/empathetic naming of thoughts patterns (e.g. 'All-Or-Nothing Filter', 'Overgeneralization', or 'None detected - gentle self-reflection').
      - cognitiveReframing (string): 2-3 therapeutic sentences offering a spacious, supportive alternative view.
      - copingExercises (array of strings): A list of 2 simple, practical exercises they can perform.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["analysisText", "identifiedDistortions", "cognitiveReframing", "copingExercises"],
          properties: {
            analysisText: {
              type: Type.STRING,
              description: "Empathetic, validating summary from a CBT therapeutic lens."
            },
            identifiedDistortions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Cognitive filters or thought patterns detected in a non-judgmental wording."
            },
            cognitiveReframing: {
              type: Type.STRING,
              description: "Alternate compassionate way to verbalize or interpret their current situation."
            },
            copingExercises: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Two step-by-step CBT or somatic practices tailored to their text."
            }
          }
        }
      }
    });

    const dataText = response.text;
    res.json(JSON.parse(dataText || "{}"));
  } catch (error: any) {
    console.error("Gemini journal analysis error:", error);
    
    // Generous, safe fallback CBT counselor logic which provides wonderful mental support anyway
    res.json({
      analysisText: "Thank you for sharing your thoughts with such courage. Writing them down is a vital step in calming an active mind and processing complex emotions.",
      identifiedDistortions: [
        "Unconscious Pressure Filter (putting demands on yourself)",
        "Overgeneralizing temporary setbacks as permanent"
      ],
      cognitiveReframing: "Instead of focusing on what didn't go perfectly today, notice that you gave yourself the time and safe space to journal. Your feelings are real, valid signals, but they are transient and do not dictate your permanent potential.",
      copingExercises: [
        "The Double-Standard Technique: Imagine your dearest friend came to you with this exact journal. Write down what comforting, generous words you would say to them.",
        "5-4-3-2-1 Grounding: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste to bring mindful safety back to the present moment."
      ],
      isFallback: true,
      errorInfo: error instanceof Error ? error.message : String(error)
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Bloom Server] Listening on http://localhost:${PORT} under environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
