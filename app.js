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
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0613', // Specify your desired chat model
            messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
            max_tokens: 50,
        });

        const output = response.choices[0].message.content;
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
