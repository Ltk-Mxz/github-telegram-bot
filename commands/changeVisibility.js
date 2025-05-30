module.exports = (bot, octokit) => {
  bot.onText(/\/changevisibility (.+) (public|private)/, async (msg, match) => {
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
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
