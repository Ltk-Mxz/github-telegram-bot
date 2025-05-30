module.exports = (bot, octokit) => {
  bot.onText(/\/searchrepo (.+)/, async (msg, match) => {
    console.log(`[BOT] /searchrepo command from ${msg.from.username || msg.from.id}:`, match[1]);
    const chatId = msg.chat.id;
    const query = match[1];
    try {
      const { data } = await octokit.search.repos({
        q: query,
        per_page: 5,
        sort: 'stars',
        order: 'desc'
      });
      if (!data.items || data.items.length === 0) {
        bot.sendMessage(chatId, "Aucun dépôt trouvé pour cette recherche.");
      } else {
        const results = data.items.map(r =>
          `• <a href="${r.html_url}">${r.full_name}</a> (${r.stargazers_count}⭐)\n${r.description || ''}`
        ).join('\n\n');
        bot.sendMessage(chatId, `Résultats de la recherche:\n${results}`, { parse_mode: 'HTML' });
      }
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
