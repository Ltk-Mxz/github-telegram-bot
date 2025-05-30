module.exports = (bot, octokit) => {
  const userBranchesCache = {};

  function sendBranchesPage(chatId, repoName, branches, page) {
    const perPage = 10;
    const totalPages = Math.ceil(branches.length / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageBranches = branches.slice(start, end);
    const message = pageBranches.length
      ? pageBranches.map(b => `• <b>${b.name}</b>`).join('\n')
      : "Aucune branche trouvée.";
    const keyboard = [];
    if (totalPages > 1) {
      const nav = [];
      if (page > 1) nav.push({ text: '⬅️ Précédent', callback_data: `branches_${repoName}_prev_${page - 1}` });
      if (page < totalPages) nav.push({ text: 'Suivant ➡️', callback_data: `branches_${repoName}_next_${page + 1}` });
      keyboard.push(nav);
    }
    bot.sendMessage(chatId, `Branches (page ${page}/${totalPages}):\n${message}`, {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: keyboard }
    });
  }

  bot.onText(/\/listbranches (.+)/, async (msg, match) => {
    console.log(`[BOT] /listbranches command from ${msg.from.username || msg.from.id}:`, match[1]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: branches } = await octokit.repos.listBranches({
        owner: user.login,
        repo: repoName
      });
      userBranchesCache[`${chatId}_${repoName}`] = branches;
      sendBranchesPage(chatId, repoName, branches, 1);
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });

  bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const match = data.match(/^branches_(.+)_(prev|next)_(\d+)$/);
    if (match) {
      const repoName = match[1];
      const page = parseInt(match[3], 10);
      const branches = userBranchesCache[`${chatId}_${repoName}`] || [];
      bot.answerCallbackQuery(query.id);
      sendBranchesPage(chatId, repoName, branches, page);
    }
  });
};
