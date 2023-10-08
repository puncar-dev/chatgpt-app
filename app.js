const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const { OpenAIApi } = require('openai');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const apiKey = process.env.OPENAI_API_KEY;

async function promptGPT(prompt) {
    try {
        const openai = new OpenAIApi({
            apiKey: apiKey,
        });

        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 50,
        });

        const output = response.data.choices[0].message.content;
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
