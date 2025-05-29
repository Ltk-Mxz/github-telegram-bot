require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { Octokit } = require('@octokit/rest');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const octokit = new Octokit({ auth: GITHUB_TOKEN });

bot.onText(/\/createrepo (.+) (public|private)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const repoName = match[1];
  const visibility = match[2];

  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: visibility === 'private'
    });
    bot.sendMessage(chatId, `✅ Dépôt créé: ${response.data.html_url}`);
  } catch (error) {
    bot.sendMessage(chatId, `❌ Erreur: ${error.message}`);
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Bienvenue ! Utilisez /createrepo <nom> <public|private> pour créer un dépôt GitHub.");
});
