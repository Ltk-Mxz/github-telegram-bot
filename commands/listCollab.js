module.exports = (bot, octokit) => {
  bot.onText(/\/listcollab (.+)/, async (msg, match) => {
    console.log(`[BOT] /listcollab command from ${msg.from.username || msg.from.id}:`, match[1]);
    const chatId = msg.chat.id;
    const repoName = match[1];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const res = await octokit.repos.listCollaborators({
        owner: user.login,
        repo: repoName
      });
      if (!res || !Array.isArray(res.data) || res.data.length === 0) {
        bot.sendMessage(chatId, "Aucun collaborateur trouvé ou accès refusé.");
      } else {
        const list = res.data.map(u => `• <b>${u.login}</b>`).join('\n');
        bot.sendMessage(chatId, `Collaborateurs:\n${list}`, { parse_mode: 'HTML' });
      }
    } catch (e) {
      bot.sendMessage(chatId, `Erreur: ${e.message}`);
    }
  });
};
