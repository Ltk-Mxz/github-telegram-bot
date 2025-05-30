module.exports = (bot, octokit) => {
  bot.onText(/\/help/, (msg) => {
    const helpText = `
<b>Commandes disponibles :</b>
/listrepos - Lister vos dépôts
/deleterepo &lt;repo&gt; - Supprimer un dépôt
/addcollab &lt;repo&gt; &lt;utilisateur&gt; - Ajouter un collaborateur
/createissue &lt;repo&gt; | &lt;titre&gt; | &lt;description&gt; - Créer une issue
/listissues &lt;repo&gt; - Lister les issues ouvertes

/repoinfo &lt;repo&gt; - Infos détaillées sur un dépôt
/changevisibility &lt;repo&gt; &lt;public|private&gt; - Changer la visibilité d'un dépôt
/listbranches &lt;repo&gt; - Lister les branches d'un dépôt
/createbranch &lt;repo&gt; &lt;branche&gt; &lt;from_branche&gt; - Créer une branche
/lastcommits &lt;repo&gt; &lt;branch&gt; [n] - Voir les derniers commits d'une branche
/setwebhook &lt;repo&gt; &lt;url&gt; - Ajouter un webhook à un dépôt
    `;
    bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'HTML' });
  });
};
