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
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        console.log("Received message:", message);
        console.log(
            "Using API key:",
            config.OPENAI_API_KEY ? config.OPENAI_API_KEY.substring(0, 20) + "..." : "Not configured"
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
            const openai = new OpenAI({
                apiKey: config.OPENAI_API_KEY,
            });

            // Call OpenAI API
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
            });

            response = completion.choices[0].message.content;
            console.log("OpenAI response received");
        } catch (error) {
            console.error("OpenAI API Error:", error);
            response = getMockResponse(message);
        }

        // Add assistant response to conversation
        conversation.push({ role: "assistant", content: response });

        res.json({
            reply: response,
            conversation: conversation.slice(-10)
        });
    } catch (error) {
        console.error("Server-side exception:", error);
        res.status(500).json({ error: "A critical server error occurred." });
    }
}; 