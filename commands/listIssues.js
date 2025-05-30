module.exports = (bot, octokit) => {
  const userIssuesCache = {};

  function sendIssuesPage(chatId, repoName, issues, page) {
    const perPage = 10;
    const totalPages = Math.ceil(issues.length / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageIssues = issues.slice(start, end);
    const message = pageIssues.length
      ? pageIssues.map(i => `• <a href="${i.html_url}">${i.title}</a>`).join('\n')
      : "Aucune issue ouverte.";
    const keyboard = [];
    if (totalPages > 1) {
      const nav = [];
      if (page > 1) nav.push({ text: '⬅️ Précédent', callback_data: `issues_${repoName}_prev_${page - 1}` });
      if (page < totalPages) nav.push({ text: 'Suivant ➡️', callback_data: `issues_${repoName}_next_${page + 1}` });
      keyboard.push(nav);
    }
    bot.sendMessage(chatId, `Issues ouvertes (page ${page}/${totalPages}):\n${message}`, {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: keyboard }
    });
  }

  bot.onText(/\/listissues (.+)/, async (msg, match) => {
    console.log(`[BOT] /listissues command from ${msg.from.username || msg.from.id}:`, match[1]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: issues } = await octokit.issues.listForRepo({
        owner: user.login,
        repo: repoName,
        state: 'open'
      });
      userIssuesCache[`${chatId}_${repoName}`] = issues;
      sendIssuesPage(chatId, repoName, issues, 1);
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });

  bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const match = data.match(/^issues_(.+)_(prev|next)_(\d+)$/);
    if (match) {
      const repoName = match[1];
      const page = parseInt(match[3], 10);
      const issues = userIssuesCache[`${chatId}_${repoName}`] || [];
      bot.answerCallbackQuery(query.id);
      sendIssuesPage(chatId, repoName, issues, page);
    }
  });
};
