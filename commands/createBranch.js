module.exports = (bot, octokit) => {
  bot.onText(/\/createbranch (.+) (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const repoName = match[1];
    const newBranch = match[2];
    const fromBranch = match[3];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: ref } = await octokit.git.getRef({
        owner: user.login,
        repo: repoName,
        ref: `heads/${fromBranch}`
      });
      await octokit.git.createRef({
        owner: user.login,
        repo: repoName,
        ref: `refs/heads/${newBranch}`,
        sha: ref.object.sha
      });
      bot.sendMessage(chatId, `✅ Branche ${newBranch} créée à partir de ${fromBranch}`);
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
