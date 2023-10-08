const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const { OpenAI } = require('openai'); // Import OpenAI

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey }); // Create a new instance of OpenAI

async function promptGPT(prompt) {
    try {
        const response = await openai.createCompletion({
            model: 'gpt-3.5-turbo-0613', // Specify your desired model
            prompt: prompt,
            max_tokens: 50,
        });

        const output = response.choices[0].text;
        return output;
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
