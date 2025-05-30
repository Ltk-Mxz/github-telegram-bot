module.exports = (bot, octokit) => {
  bot.onText(/\/setwebhook (.+) (.+)/, async (msg, match) => {
    console.log(`[BOT] /setwebhook command from ${msg.from.username || msg.from.id}:`, match[1], match[2]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    const url = match[2];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      await octokit.repos.createWebhook({
        owner: user.login,
        repo: repoName,
        config: {
          url,
          content_type: 'json'
        },
        events: ['push', 'issues'],
        active: true
      });
      bot.sendMessage(chatId, `✅ Webhook ajouté à ${repoName} : ${url}`);
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
