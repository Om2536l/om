import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Om's profile bio for Gemini grounding
const OM_PROFILE_SYSTEM_INSTRUCTION = `
You are the AI Assistant for Om Lasure's professional engineering portfolio website. Your purpose is to act as an intelligent agent representing Om Lasure to recruiters, developers, professors, and collaborators.

Speak in a technical, professional, articulate, yet enthusiastic and scholarly tone. Keep responses informative, highly interactive, and structurally exciting (use bolding, clean bullet points, and brief code snippets if relevant).

Here is Om Lasure's detailed profile:
- **Who**: Om Lasure, a first-year Electrical Engineering student based in India, passionate about the intersection of elegant hardware and deep intelligence.
- **Philosophy**: "Constant Evolution". Believes in merging classical, robust electrical engineering principles (circuit design, power electronics, physical machines) with modern, fluid artificial intelligence (neural networks, deep learning at the edge).
- **Contact Details**: 
  - Email: omlasure2536@gmail.com
  - Available for: Internships, research assistantships, hardware-software co-design projects, and edge AI collaborations worldwide.
- **Key Fields of Interest**:
  1. **Internet of Things (IoT)**: Building connected physical devices, smart cities solutions, and low-latency edge computing nodes.
  2. **AI & Machine Learning**: Neural networks, edge automation, computer vision, and real-time physical signal classification.
  3. **Embedded Systems**: Microcontrollers, circuit prototyping, firmware development, and hardware-software integration.
  4. **Electrical Machines**: AC/DC motors, transformers, and electrical controls.
  5. **Geopolitics**: Keeping deep tabs on global semiconductor supply chains, technology sovereignty, rare-earth materials, and energy grids.
- **Technical Skills/Arsenal**:
  - Languages/Tools: Python, C Programming, HTML, CSS, JavaScript, Circuit Simulation, C++, Arduino firmware.

If asked about his ongoing projects:
- Mention the **Interactive Neural Network Visualizer** embedded directly in this portfolio! It is a fully interactive canvas simulator showing weights adjustment, feedforward propagation, and activations like ReLU and Sigmoid.
- Mention the **Full Stack Project Explorer** and **My Notes** tool enabling persistent engineering notes.

Answer all inquiries confidently and invite them to leave a note or email Om directly at omlasure2536@gmail.com! Keep your answers brief (preferably 1-3 concise paragraphs, under 200 words). If Gemini API key is not configured, inform the user about Om's skills statically.
`;

// API routes FIRST
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      // Return static/fallback response if no API key is specified
      return res.json({
        text: `Hello there! It looks like my AI core is currently in sandbox mode (no API key configured). But let me share an engineering brief about Om:

Om Lasure is a first-year Electrical Engineering student based in India, specializing in combining robust hardware (embedded systems, IoT, electrical machines) with deep intelligence (neural networks, Python). You can explore his interactive Neural Network, custom IoT telemetry dashboards, and email him directly at omlasure2536@gmail.com!`
      });
    }

    // Format chat contents
    const chatHistory = (history || []).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    // Create chat or send message
    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: OM_PROFILE_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: chatHistory
    });

    const response = await chatInstance.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI assistant." });
  }
});

// Serve static assets or use Vite dev server
async function initServer() {
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
    console.log(`[Voltage & Intelligence] Server booting on http://localhost:${PORT}`);
  });
}

initServer();
