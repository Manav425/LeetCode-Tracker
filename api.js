async function fetchUser(username) {
  const response = await fetch(`/.netlify/functions/leetcode?username=${username}`);

  if (!response.ok) throw new Error(`User "${username}" not found.`);

  const data = await response.json();

  if (data.status === 'error') throw new Error(`User "${username}" not found.`);

  return data;
}