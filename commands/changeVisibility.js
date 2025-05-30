module.exports = (bot, octokit) => {
  bot.onText(/\/changevisibility (.+) (public|private)/, async (msg, match) => {
    console.log(`[BOT] /changevisibility command from ${msg.from.username || msg.from.id}:`, match[1], match[2]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    const visibility = match[2];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      await octokit.repos.update({
        owner: user.login,
        repo: repoName,
        private: visibility === 'private'
      });
      bot.sendMessage(chatId, `✅ Visibilité changée pour ${repoName} : ${visibility}`);
    } catch (e) {
      // Gestion d'erreur plus explicite pour les droits ou repo inexistant
      if (e.status === 404) {
        bot.sendMessage(chatId, `Erreur : dépôt introuvable ou vous n'avez pas les droits.`);
      } else if (e.status === 422) {
        bot.sendMessage(chatId, `Erreur : la visibilité est déjà "${visibility}".`);
      } else {
        bot.sendMessage(chatId, `Erreur: ${e.message}`);
      }
    }
  });
};
