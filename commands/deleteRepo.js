module.exports = (bot, octokit) => {
  bot.onText(/\/deleterepo (.+)/, async (msg, match) => {
    console.log(`[BOT] /deleterepo command from ${msg.from.username || msg.from.id}:`, match[1]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      await octokit.repos.delete({ owner: user.login, repo: repoName });
      bot.sendMessage(chatId, `✅ Dépôt supprimé: ${repoName}`);
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
