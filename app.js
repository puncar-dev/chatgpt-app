const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
console.log("API Key:", apiKey);  // Print the API key to the console


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
    console.log(output);

    // Implement rate limiting by adding a delay (e.g., 2 seconds) between requests
    setTimeout(() => {
      // Make your next request here
    }, 2000); // Delay in milliseconds
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example usage:
promptGPT('Translate the following English text to French: "Hello, world!"');
