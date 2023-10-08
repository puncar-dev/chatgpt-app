const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const { OpenAIApi } = require('openai'); // Import OpenAI (note the import change to OpenAIApi)

app.use(express.static('public'));
app.use(express.json()); // Parse JSON request bodies

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi({ key: apiKey }); // Create a new instance of OpenAIApi

async function promptGPT(prompt) {
    try {
        const response = await openai.completions.create({
            engine: 'gpt-3.5-turbo', // Specify your desired chat model (note the model name change)
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }, // User message
                // Optionally, you can add more user and assistant messages as the conversation progresses.
            ],
            max_tokens: 50,
        });

        // Extract and display the assistant's response
        const assistantResponse = response.choices.find((message) => message.role === 'assistant');
        if (assistantResponse) {
            return assistantResponse.text; // Use 'text' to get the content of the response
        } else {
            // Handle the case where there is no assistant response
            return 'No response from the assistant.';
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/prompt', async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const output = await promptGPT(prompt);
        res.json({ response: output });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
