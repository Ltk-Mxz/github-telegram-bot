module.exports = (bot, octokit) => {
  bot.onText(/\/listissues (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const repoName = match[1];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: issues } = await octokit.issues.listForRepo({
        owner: user.login,
        repo: repoName,
        state: 'open'
      });
      if (issues.length === 0) {
        bot.sendMessage(chatId, "Aucune issue ouverte.");
      } else {
        const list = issues.map(i => `• <a href="${i.html_url}">${i.title}</a>`).join('\n');
        bot.sendMessage(chatId, `Issues ouvertes:\n${list}`, { parse_mode: 'HTML' });
      }
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
