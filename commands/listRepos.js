module.exports = (bot, octokit) => {
  bot.onText(/\/listrepos/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      const { data } = await octokit.repos.listForAuthenticatedUser({ per_page: 10 });
      if (data.length === 0) {
        bot.sendMessage(chatId, "Aucun dépôt trouvé.");
      } else {
        const repos = data.map(r => `• <a href="${r.html_url}">${r.name}</a>`).join('\n');
        bot.sendMessage(chatId, `Vos dépôts:\n${repos}`, { parse_mode: 'HTML' });
      }
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
