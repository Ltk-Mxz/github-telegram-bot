module.exports = (bot, octokit) => {
  bot.onText(/\/searchmyrepo (.+)/, async (msg, match) => {
    console.log(`[BOT] /searchmyrepo command from ${msg.from.username || msg.from.id}:`, match[1]);
    const chatId = msg.chat.id;
    const query = match[1].toLowerCase();
    try {
      // Pagination pour récupérer tous les dépôts
      let page = 1;
      let allRepos = [];
      while (true) {
        const { data } = await octokit.repos.listForAuthenticatedUser({ per_page: 100, page });
        if (data.length === 0) break;
        allRepos = allRepos.concat(data);
        if (data.length < 100) break;
        page++;
      }
      // Filtrer par nom ou description
      const results = allRepos.filter(r =>
        r.name.toLowerCase().includes(query) ||
        (r.description && r.description.toLowerCase().includes(query))
      );
      if (results.length === 0) {
        bot.sendMessage(chatId, "Aucun dépôt correspondant à votre recherche.");
      } else {
        const list = results.slice(0, 10).map(r =>
          `• <a href="${r.html_url}">${r.full_name}</a> (${r.stargazers_count}⭐)\n${r.description || ''}`
        ).join('\n\n');
        bot.sendMessage(chatId, `Résultats de la recherche dans vos dépôts:\n${list}`, { parse_mode: 'HTML' });
      }
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
