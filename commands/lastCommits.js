module.exports = (bot, octokit) => {
  bot.onText(/\/lastcommits (.+) (.+) ?(\d+)?/, async (msg, match) => {
    console.log(`[BOT] /lastcommits command from ${msg.from.username || msg.from.id}:`, match[1], match[2], match[3]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    const branch = match[2];
    const n = match[3] ? parseInt(match[3], 10) : 5;
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: commits } = await octokit.repos.listCommits({
        owner: user.login,
        repo: repoName,
        sha: branch,
        per_page: n
      });
      if (commits.length === 0) {
        bot.sendMessage(chatId, "Aucun commit trouvé.");
      } else {
        const list = commits.map(c => `• <a href="${c.html_url}">${c.commit.message.split('\n')[0]}</a> par <b>${c.commit.author.name}</b>`).join('\n');
        bot.sendMessage(chatId, `Derniers commits:\n${list}`, { parse_mode: 'HTML' });
      }
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
