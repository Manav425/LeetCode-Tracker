function generateInsights(data) {
  const insights = [];
  const { easySolved, mediumSolved, hardSolved, totalSolved } = data;
  const easyPct   = totalSolved ? Math.round((easySolved / totalSolved) * 100) : 0;
  const mediumPct = totalSolved ? Math.round((mediumSolved / totalSolved) * 100) : 0;
  const hardPct   = totalSolved ? Math.round((hardSolved / totalSolved) * 100) : 0;

  if (totalSolved === 0) {
    insights.push({ type: 'warning', text: "No problems solved yet. Start with Easy problems to build confidence." });
    return insights;
  }
  if (easyPct > 70)
    insights.push({ type: 'warning', text: `${easyPct}% of your solves are Easy. Push into Medium territory.` });
  else if (easyPct < 20 && totalSolved > 50)
    insights.push({ type: 'success', text: "Strong foundation — you've moved well beyond Easy problems." });

  if (mediumPct >= 40 && mediumPct <= 60)
    insights.push({ type: 'success', text: "Great Medium balance. Sweet spot for interview prep." });
  else if (mediumPct < 30 && totalSolved > 30)
    insights.push({ type: 'warning', text: "Medium problems are the core of FAANG interviews. Prioritise them." });

  if (hardSolved === 0)
    insights.push({ type: 'info', text: "No Hard problems yet — aim for your first Hard after 50 Mediums." });
  else if (hardPct >= 20)
    insights.push({ type: 'success', text: `${hardPct}% Hard solve rate — impressive. Highlights well on a resume.` });

  if (totalSolved >= 100)
    insights.push({ type: 'success', text: "100+ problems solved. You're in the top tier of applicants." });
  else if (totalSolved >= 50)
    insights.push({ type: 'info', text: "50+ problems solved. Keep the momentum — aim for 100." });
  else
    insights.push({ type: 'info', text: `${totalSolved} solved. Consistency beats intensity — solve 1 problem daily.` });

  return insights;
}

function getConsistencyScore(totalSolved) {
  if (totalSolved >= 300) return { score: 100, label: 'Elite' };
  if (totalSolved >= 200) return { score: 85,  label: 'Advanced' };
  if (totalSolved >= 100) return { score: 65,  label: 'Intermediate' };
  if (totalSolved >= 50)  return { score: 40,  label: 'Beginner' };
  return { score: 15, label: 'Just Started' };
}

function getDailyGoal(data) {
  const { easySolved, mediumSolved, hardSolved, totalSolved } = data;
  if (totalSolved === 0)  return "Solve 2 Easy problems today to get started.";
  if (hardSolved === 0)   return "Try 1 Hard problem today — push your limits.";
  if (mediumSolved < easySolved * 0.5)
    return "Solve 3 Medium problems today — they're your weakest area.";
  if (totalSolved < 50)   return "Solve 2 problems today — Easy + Medium combo.";
  return "Maintain your streak — solve at least 1 problem today.";
}

function sortLeaderboard(users) {
  return [...users].sort((a, b) => b.data.totalSolved - a.data.totalSolved);
}