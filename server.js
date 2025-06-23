const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const config = require("./config");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

// Function to provide mock responses when OpenAI API fails
function getMockResponse(message) {
  console.log('Using mock response for:', message);
  return "I'm sorry, but I'm currently having trouble connecting to my brain. This is a fallback response. Please try again later or contact support if this persists.";
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'uploads'),
  debug: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  abortOnLimit: false,
  createParentPath: true,
}));

// Store conversation history
const conversations = new Map();

// API Routes
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Received message:", message);
    console.log(
      "Using API key:",
      config.OPENAI_API_KEY.substring(0, 20) + "..."
    );

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const conversation = conversations.get(sessionId);

    // Add user message to conversation
    conversation.push({ role: "user", content: message });

    // Create system message with personality
    const systemMessage = {
      role: "system",
      content: config.PERSONALITY_PROMPT,
    };

    // Prepare messages for OpenAI
    const messages = [systemMessage, ...conversation.slice(-10)]; // Keep last 10 messages for context

    console.log("Sending to OpenAI:", messages.length, "messages");

    let response;

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using gpt-3.5-turbo for better compatibility
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      response = completion.choices[0].message.content;
      console.log("OpenAI response received");
    } catch (error) {
      // Log the error for debugging on Vercel
      console.error("OpenAI API Error:", error);

      // Fallback to a mock response for demonstration
      response = getMockResponse(message);
    }

    // Add assistant response to conversation
    conversation.push({ role: "assistant", content: response });

    res.json({
      reply: response,
      conversation: conversation.slice(-10) // Return last 10 messages
    });
  } catch (error) {
    console.error("Server-side exception:", error);
    res.status(500).json({ error: "A critical server error occurred." });
  }
});

// Text-to-speech endpoint
app.post("/api/speak", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length,
    });

    res.send(buffer);
  } catch (error) {
    console.error("TTS Error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate speech", details: error.message });
  }
});

// Voice input endpoint
app.post("/api/voice", async (req, res) => {
  try {
    console.log("Received /api/voice request");
    console.log("Request headers:", req.headers);
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Request files:", req.files ? Object.keys(req.files) : "No files");

    if (!req.files || !req.files.audio) {
      console.error("Missing audio file in request");
      return res.status(400).json({ error: "Audio file is required" });
    }

    const sessionId = req.body.sessionId;
    const audioFile = req.files.audio;

    console.log("Received audio file:", audioFile.name);
    console.log("File details:", {
      size: audioFile.size,
      mimetype: audioFile.mimetype,
      tempFilePath: audioFile.tempFilePath
    });
    console.log("From session:", sessionId);

    // Make sure the temp file exists before proceeding
    if (!fs.existsSync(audioFile.tempFilePath)) {
      console.error("Temp file does not exist:", audioFile.tempFilePath);
      return res.status(500).json({ error: "Audio file processing error" });
    }

    // --- Start of FFmpeg Conversion ---
    const convertedFilePath = path.join(__dirname, 'uploads', `${audioFile.name}.mp3`);

    await new Promise((resolve, reject) => {
      ffmpeg(audioFile.tempFilePath)
        .toFormat('mp3')
        .on('end', () => {
          console.log('FFmpeg conversion finished.');
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg conversion error:', err);
          reject(err);
        })
        .save(convertedFilePath);
    });
    // --- End of FFmpeg Conversion ---

    console.log("Preparing to transcribe audio...");

    let transcription;
    try {
      // Transcribe the audio using OpenAI's Whisper API
      transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(convertedFilePath),
        model: "whisper-1",
      });

      console.log("Transcription successful");
    } catch (transcriptionError) {
      console.error("Transcription error:", transcriptionError);
      return res.status(500).json({ error: "Failed to transcribe audio", details: transcriptionError.message });
    }

    const transcript = transcription.text;
    console.log("Transcription:", transcript);

    if (!transcript || transcript.trim() === "") {
      return res
        .status(422)
        .json({ error: "Could not transcribe audio. Please try again." });
    }

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const conversation = conversations.get(sessionId);

    // Add user message to conversation
    conversation.push({ role: "user", content: transcript });

    // Create system message with personality
    const systemMessage = {
      role: "system",
      content: config.PERSONALITY_PROMPT,
    };

    // Prepare messages for OpenAI
    const messages = [systemMessage, ...conversation.slice(-10)]; // Keep last 10 messages for context

    let response;
    let audioUrl = null;

    try {
      // Call OpenAI API for chat response
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      response = completion.choices[0].message.content;

      // Generate audio from the response
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: response,
      });

      // Create a unique filename for the audio
      const audioFilename = "response_" + Date.now() + ".mp3";
      const audioPath = path.join(__dirname, "public", "audio", audioFilename);

      // Ensure audio directory exists
      if (!fs.existsSync(path.join(__dirname, "public", "audio"))) {
        fs.mkdirSync(path.join(__dirname, "public", "audio"), { recursive: true });
      }

      // Save the audio file
      const buffer = Buffer.from(await mp3.arrayBuffer());
      fs.writeFileSync(audioPath, buffer);

      // Set the URL for the audio file
      audioUrl = "/audio/" + audioFilename;
    } catch (error) {
      console.error("AI Processing Error:", error);
      response = getMockResponse(transcript);
    }

    // Add assistant response to conversation
    conversation.push({ role: "assistant", content: response });

    res.json({
      transcript: transcript,
      reply: response,
      audioUrl: audioUrl,
      conversation: conversation.slice(-10) // Return last 10 messages
    });
  } catch (error) {
    console.error("Voice processing error:", error);
    res.status(500).json({
      error: "Failed to process voice input",
      details: error.message,
    });
  }
});

// Error handler middleware for file upload errors
app.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: "File too large" });
  }
  next(err);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Voice Bot is running" });
});

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  console.log("Open http://localhost:" + PORT + " in your browser");
  console.log("API Key configured: " + (config.OPENAI_API_KEY ? "Yes" : "No"));
});
