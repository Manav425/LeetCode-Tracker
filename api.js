const API_BASE = 'https://leetcode-stats-api.herokuapp.com/';

async function fetchUser(username) {
  const response = await fetch(`${API_BASE}${username}`);
  const data = await response.json();
  if (data.status === 'error') throw new Error(`User "${username}" not found.`);
  return data;
}