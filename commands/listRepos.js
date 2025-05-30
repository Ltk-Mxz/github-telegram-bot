module.exports = (bot, octokit) => {
  // Helper pour générer le message et les boutons
  function sendReposPage(chatId, repos, page) {
    const perPage = 10;
    const totalPages = Math.ceil(repos.length / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageRepos = repos.slice(start, end);
    const message = pageRepos.length
      ? pageRepos.map(r => `• <a href="${r.html_url}">${r.name}</a>`).join('\n')
      : "Aucun dépôt trouvé.";
    const keyboard = [];
    if (totalPages > 1) {
      const nav = [];
      if (page > 1) nav.push({ text: '⬅️ Précédent', callback_data: `repos_prev_${page - 1}` });
      if (page < totalPages) nav.push({ text: 'Suivant ➡️', callback_data: `repos_next_${page + 1}` });
      keyboard.push(nav);
    }
    bot.sendMessage(chatId, `Vos dépôts (page ${page}/${totalPages}):\n${message}`, {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: keyboard }
    });
  }

  // Stockage temporaire des dépôts par utilisateur
  const userReposCache = {};

  bot.onText(/\/listrepos/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      // Pagination GitHub pour tout récupérer
      let page = 1;
      let allRepos = [];
      while (true) {
        const { data } = await octokit.repos.listForAuthenticatedUser({ per_page: 100, page });
        if (data.length === 0) break;
        allRepos = allRepos.concat(data);
        if (data.length < 100) break;
        page++;
      }
      userReposCache[chatId] = allRepos;
      sendReposPage(chatId, allRepos, 1);
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });

  // Gestion des boutons "Suivant/Précédent"
  bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    if (data.startsWith('repos_')) {
      const allRepos = userReposCache[chatId] || [];
      const match = data.match(/repos_(prev|next)_(\d+)/);
      if (match) {
        const page = parseInt(match[2], 10);
        bot.answerCallbackQuery(query.id);
        sendReposPage(chatId, allRepos, page);
      }
    }
  });
};
