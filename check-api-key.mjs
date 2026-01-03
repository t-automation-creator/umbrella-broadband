import fetch from 'node-fetch';

async function checkApiKey() {
  try {
    const response = await fetch('http://localhost:3000/trpc/chat.debugApiKey');
    const result = await response.json();
    console.log('Server API Key Debug Info:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkApiKey();
