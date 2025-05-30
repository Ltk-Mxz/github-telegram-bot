module.exports = (bot, octokit) => {
  bot.onText(/\/listbranches (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const repoName = match[1];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: branches } = await octokit.repos.listBranches({
        owner: user.login,
        repo: repoName
      });
      if (branches.length === 0) {
        bot.sendMessage(chatId, "Aucune branche trouvée.");
      } else {
        const list = branches.map(b => `• <b>${b.name}</b>`).join('\n');
        bot.sendMessage(chatId, `Branches:\n${list}`, { parse_mode: 'HTML' });
      }
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
