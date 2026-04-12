const fetch = require('node-fetch');

exports.handler = async function(event) {
  const username = event.queryStringParameters.username;

  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username is required' })
    };
  }

  try {
    const response = await fetch(`https://leetcode-stats.tashif.codes/${username}`);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API failed' })
    };
  }
};