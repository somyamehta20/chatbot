const OpenAI = require("openai");
const config = require("../config");

// Store conversation history (Note: This will reset on each function call in production)
const conversations = new Map();

// Function to provide mock responses when OpenAI API fails
function getMockResponse(message) {
    console.log('Using mock response for:', message);
    return "I'm sorry, but I'm currently having trouble connecting to my brain. This is a fallback response. Please try again later or contact support if this persists.";
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log("Received /api/voice request");

        // For Vercel deployment, we'll need to handle file uploads differently
        // Since Vercel doesn't support FFmpeg, we'll use a simplified approach
        // that works with the audio data directly

        // For now, we'll return a message indicating voice features need to be configured
        // In a full implementation, you'd need to use a service like AssemblyAI or similar

        res.json({
            transcript: "Voice input is currently being configured for Vercel deployment. Please use text input for now.",
            reply: "I'm currently being deployed to Vercel and voice features are being configured. Please use the text input for now, and voice features will be available soon!",
            audioUrl: null,
            conversation: []
        });

    } catch (error) {
        console.error("Voice processing error:", error);
        res.status(500).json({
            error: "Voice features are currently being configured for Vercel deployment",
            details: error.message,
        });
    }
}; 