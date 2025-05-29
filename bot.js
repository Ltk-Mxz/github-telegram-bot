require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Charger dynamiquement tous les modules de commandes
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsPath, file));
    if (typeof command === 'function') {
      command(bot, octokit);
    }
  }
});

// Commande /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Bienvenue ! Utilisez /help pour voir les commandes disponibles.");
});
