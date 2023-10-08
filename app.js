const axios = require('axios');

// Access the API key from the environment variables
const apiKey = process.env.OPENAI_API_KEY;

// Define a function to interact with the OpenAI API
async function promptGPT(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      prompt,
      max_tokens: 50, // Adjust as needed
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const output = response.data.choices[0].text;
    console.log(output);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example usage:
promptGPT('Translate the following English text to French: "Hello, world!"');
