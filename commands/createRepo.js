module.exports = (bot, octokit) => {
  bot.onText(/\/createrepo (.+) (public|private)/, async (msg, match) => {
    console.log(`[BOT] /createrepo command from ${msg.from.username || msg.from.id}:`, match[1], match[2]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    const visibility = match[2];
    try {
      const response = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: visibility === 'private'
      });
      bot.sendMessage(chatId, `✅ Dépôt créé: <a href="${response.data.html_url}">${response.data.html_url}</a>`, { parse_mode: 'HTML' });
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
