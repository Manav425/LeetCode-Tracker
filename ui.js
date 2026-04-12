function buildChart(canvasId, easy, medium, hard) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [{
        data: [easy, medium, hard],
        backgroundColor: ['#00b8a3', '#f89f1b', '#ef4743'],
        borderColor: 'var(--card-bg)',
        borderWidth: 3,
        hoverOffset: 6,
      }]
    },
    options: {
      cutout: '72%',
      animation: { animateRotate: true, duration: 800 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#aaa', font: { size: 12 }, padding: 16 }
        },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} solved` }
        }
      }
    }
  });
}

function buildInsightsHTML(insights) {
  const icons = { success: '✓', warning: '!', info: 'i' };
  const items = insights.map(i => `
    <div class="insight-item insight-${i.type}">
      <span class="insight-icon">${icons[i.type]}</span>
      <p>${i.text}</p>
    </div>
  `).join('');
  return `<div class="insights-section">
    <h3 class="insights-title">Performance Insights</h3>${items}
  </div>`;
}

function buildConsistencyHTML(totalSolved, dailyGoal) {
  const { score, label } = getConsistencyScore(totalSolved);
  return `
    <div class="consistency-section">
      <h3 class="insights-title">Consistency Score</h3>
      <div class="consistency-bar-wrap">
        <div class="consistency-bar" style="width: ${score}%"></div>
      </div>
      <div class="consistency-meta">
        <span class="consistency-label">${label}</span>
        <span class="consistency-score">${score}/100</span>
      </div>
      <div class="daily-goal">
        <span class="goal-icon">🎯</span>
        <p>${dailyGoal}</p>
      </div>
    </div>
  `;
}

function buildCard(username, data, chartId) {
  const insights = generateInsights(data);
  const dailyGoal = getDailyGoal(data);
  return `
    <div class="result-card">
      <p class="username">@${username}</p>
      <div class="stats-grid">
        <div class="stat-box total"><div class="stat-number">${data.totalSolved}</div><div class="stat-label">Total</div></div>
        <div class="stat-box easy"><div class="stat-number">${data.easySolved}</div><div class="stat-label">Easy</div></div>
        <div class="stat-box medium"><div class="stat-number">${data.mediumSolved}</div><div class="stat-label">Medium</div></div>
        <div class="stat-box hard"><div class="stat-number">${data.hardSolved}</div><div class="stat-label">Hard</div></div>
      </div>
      <div class="chart-wrapper"><canvas id="${chartId}"></canvas></div>
      ${buildConsistencyHTML(data.totalSolved, dailyGoal)}
      ${buildInsightsHTML(insights)}
    </div>
  `;
}

function buildLeaderboardHTML(users) {
  const sorted = sortLeaderboard(users);
  const medals = ['🥇', '🥈', '🥉'];
  const rows = sorted.map((u, i) => `
    <div class="lb-row ${i === 0 ? 'lb-top' : ''}">
      <span class="lb-rank">${medals[i] || `#${i + 1}`}</span>
      <span class="lb-name">@${u.username}</span>
      <span class="lb-easy">${u.data.easySolved}E</span>
      <span class="lb-medium">${u.data.mediumSolved}M</span>
      <span class="lb-hard">${u.data.hardSolved}H</span>
      <span class="lb-total">${u.data.totalSolved} solved</span>
    </div>
  `).join('');
  return `
    <div class="leaderboard">
      <h3 class="insights-title">Leaderboard</h3>
      ${rows}
    </div>
  `;
}

function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('lc_theme', dark ? 'dark' : 'light');
}