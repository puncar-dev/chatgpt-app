const axios = require('axios');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const apiKey = process.env.OPENAI_API_KEY;

async function promptGPT(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt,
            max_tokens: 50,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        const output = response.data.choices[0].text;
        return output;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/get-completion', async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const output = await promptGPT(prompt);
        res.json({ output });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
