const searchBtn      = document.getElementById('search-btn');
const usernameInput  = document.getElementById('username-input');
const resultSection  = document.getElementById('result-section');
const compareBtn     = document.getElementById('compare-btn');
const user1Input     = document.getElementById('user1-input');
const user2Input     = document.getElementById('user2-input');
const compareSection = document.getElementById('compare-section');
const lbInput        = document.getElementById('lb-input');
const lbAddBtn       = document.getElementById('lb-add-btn');
const lbSection      = document.getElementById('lb-section');
const themeToggle    = document.getElementById('theme-toggle');
const tabs           = document.querySelectorAll('.tab');
const panels         = document.querySelectorAll('.panel');

let leaderboardUsers = [];

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
  });
});

async function handleSearch() {
  const username = usernameInput.value.trim();
  if (!username) {
    resultSection.innerHTML = '<div class="error-msg">Please enter a username.</div>';
    return;
  }
  localStorage.setItem('lc_last_username', username);
  searchBtn.disabled = true;
  resultSection.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const data = await fetchUser(username);
    resultSection.innerHTML = buildCard(username, data, 'main-chart');
    buildChart('main-chart', data.easySolved, data.mediumSolved, data.hardSolved);
  } catch (err) {
    resultSection.innerHTML = `<div class="error-msg">${err.message}</div>`;
  } finally {
    searchBtn.disabled = false;
  }
}

async function handleCompare() {
  const u1 = user1Input.value.trim();
  const u2 = user2Input.value.trim();
  if (!u1 || !u2) {
    compareSection.innerHTML = '<div class="error-msg">Please enter both usernames.</div>';
    return;
  }
  compareBtn.disabled = true;
  compareSection.innerHTML = '<p class="loading">Fetching both users...</p>';
  try {
    const [data1, data2] = await Promise.all([fetchUser(u1), fetchUser(u2)]);
    compareSection.innerHTML = `
      <div class="compare-grid">
        ${buildCard(u1, data1, 'chart-user1')}
        ${buildCard(u2, data2, 'chart-user2')}
      </div>`;
    buildChart('chart-user1', data1.easySolved, data1.mediumSolved, data1.hardSolved);
    buildChart('chart-user2', data2.easySolved, data2.mediumSolved, data2.hardSolved);
  } catch (err) {
    compareSection.innerHTML = `<div class="error-msg">${err.message}</div>`;
  } finally {
    compareBtn.disabled = false;
  }
}

async function handleLeaderboardAdd() {
  const username = lbInput.value.trim();
  if (!username) return;
  if (leaderboardUsers.find(u => u.username === username)) {
    lbSection.innerHTML = `<div class="error-msg">"${username}" is already in the leaderboard.</div>`;
    return;
  }
  lbAddBtn.disabled = true;
  lbSection.innerHTML = '<p class="loading">Fetching...</p>';
  try {
    const data = await fetchUser(username);
    leaderboardUsers.push({ username, data });
    lbInput.value = '';
    lbSection.innerHTML = buildLeaderboardHTML(leaderboardUsers);
  } catch (err) {
    lbSection.innerHTML = `<div class="error-msg">${err.message}</div>`;
  } finally {
    lbAddBtn.disabled = false;
  }
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
  themeToggle.textContent = isDark ? '🌙' : '☀️';
});

searchBtn.addEventListener('click', handleSearch);
usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
compareBtn.addEventListener('click', handleCompare);
user1Input.addEventListener('keydown', e => { if (e.key === 'Enter') handleCompare(); });
user2Input.addEventListener('keydown', e => { if (e.key === 'Enter') handleCompare(); });
lbAddBtn.addEventListener('click', handleLeaderboardAdd);
lbInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleLeaderboardAdd(); });

(function init() {
  const savedTheme = localStorage.getItem('lc_theme') || 'dark';
  setTheme(savedTheme === 'dark');
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  const saved = localStorage.getItem('lc_last_username');
  if (saved) { usernameInput.value = saved; handleSearch(); }
})();