module.exports = (bot, octokit) => {
  bot.onText(/\/createissue (.+) \| (.+) \| (.+)/, async (msg, match) => {
    console.log(`[BOT] /createissue command from ${msg.from.username || msg.from.id}:`, match[1], match[2]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    const title = match[2];
    const body = match[3];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: issue } = await octokit.issues.create({
        owner: user.login,
        repo: repoName,
        title,
        body
      });
      bot.sendMessage(chatId, `✅ Issue créée: <a href="${issue.html_url}">${issue.title}</a>`, { parse_mode: 'HTML' });
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
