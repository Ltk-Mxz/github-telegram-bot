module.exports = (bot, octokit) => {
  bot.onText(/\/addcollab (.+) (.+)/, async (msg, match) => {
    console.log(`[BOT] /addcollab command from ${msg.from.username || msg.from.id}:`, match[1], match[2]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    const username = match[2];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      await octokit.repos.addCollaborator({ owner: user.login, repo: repoName, username });
      bot.sendMessage(chatId, `✅ Collaborateur ${username} ajouté à ${repoName}`);
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
