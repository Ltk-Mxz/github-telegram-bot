module.exports = (bot, octokit) => {
  bot.onText(/\/repoinfo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const repoName = match[1];
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const repoResponse = await octokit.repos.get({ owner: user.login, repo: repoName });
      if (!repoResponse || !repoResponse.data) {
        bot.sendMessage(chatId, "Dépôt introuvable ou accès refusé.");
        return;
      }
      const repo = repoResponse.data;
      const info = `<b>${repo.full_name}</b>
Description: ${repo.description || 'Aucune'}
Visibilité: ${repo.private ? 'Privé' : 'Public'}
⭐ Stars: ${repo.stargazers_count}
🍴 Forks: ${repo.forks_count}
Issues: ${repo.open_issues_count}
URL: <a href="${repo.html_url}">${repo.html_url}</a>`;
      bot.sendMessage(chatId, info, { parse_mode: 'HTML' });
    } catch (e) {
      if (e.status === 404) {
        bot.sendMessage(chatId, "Dépôt introuvable ou accès refusé.");
      } else {
        bot.sendMessage(chatId, `Erreur: ${e.message}`);
      }
    }
  });
};
