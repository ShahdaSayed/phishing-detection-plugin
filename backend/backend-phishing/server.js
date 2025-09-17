const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG = {
    endpoint: "https://aashish-hack-25-rg.cognitiveservices.azure.com/openai/v1/",
    modelName: "gpt-4.1",
    deployment_name: "gpt-4.1",
    api_key: "<api-key>" // Your actual API key
};

const symbolMap = {
  '.': '[dot]',
  '-': '[hyphen]',
  ',': '[comma]',
  '!': '[exclamation]'
};

// Initialize OpenAI client
let openaiClient = null;

// Initialize OpenAI client
function initializeOpenAI() {
    if (CONFIG.api_key === "") {
        console.error("⚠️  Please set your API key in the CONFIG object or OPENAI_API_KEY environment variable");
        return false;
    }
    try {
        openaiClient = new OpenAI({
            baseURL: CONFIG.endpoint,
            apiKey: CONFIG.api_key
        });
        console.log("✅ OpenAI client initialized successfully");
        return true;
    } catch (error) {
        console.error("❌ Failed to initialize OpenAI client:", error);
        return false;
    }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API endpoint to process messages
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({
                error: 'Invalid message',
                details: 'Message is required and must be a non-empty string'
            });
        }

        const obfuscatedMessage = message.replace(/\s+/g, ' ')            
                                .trim()                          
                                .split('')                       
                                .map(char => symbolMap[char] || char) 
                                .join('');

        if (!openaiClient) {
            return res.status(500).json({
                error: 'OpenAI client not initialized',
                details: 'Please check API key configuration'
            });
        }

        const completion = await openaiClient.chat.completions.create({
            messages: [
                { role: "user", content: obfuscatedMessage.trim() }
            ],
            model: CONFIG.deployment_name
        });

        const response = completion.choices[0]?.message?.content;

        if (!response) {
            throw new Error('No response received from OpenAI');
        }

        console.log('📥 Received response from OpenAI', response);

        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error in /api/chat:', error);

        let errorMessage = 'An error occurred while processing your request';
        let statusCode = 500;

        if (error.status === 401) {
            errorMessage = 'Invalid API key. Please check your API key configuration.';
            statusCode = 401;
        } else if (error.status === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
            statusCode = 429;
        } else if (error.status === 500) {
            errorMessage = 'OpenAI server error. Please try again later.';
            statusCode = 500;
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(statusCode).json({
            error: errorMessage,
            details: error.message || 'Unknown error occurred'
        });
    }
});

// Start server
function startServer() {
    const openaiInitialized = initializeOpenAI();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📁 Serving files from: ${__dirname}`);
        
        if (!openaiInitialized) {
            console.log(`⚠️  OpenAI not initialized. Please set your API key.`);
        }
        
    });
}

startServer();