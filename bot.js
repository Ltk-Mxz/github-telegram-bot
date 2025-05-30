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

// Commande /help
bot.onText(/\/help/, (msg) => {
  const helpMessage = `
Voici les commandes disponibles :
/start - Bienvenue dans le bot Github ! Utilisez cette commande pour démarrer.
/help - Affiche cette aide.
`;
  bot.sendMessage(msg.chat.id, helpMessage);
});

// Gestion des erreurs
bot.on('polling_error', (error) => {
  console.error(`Polling error: ${error.code} - ${error.message}`);
});

// Gestion des erreurs d'API GitHub
octokit.hook.error('request', (error) => {
  console.error(`GitHub API error: ${error.message}`);
});

// Gestion des erreurs de commande
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, "Commande inconnue. Utilisez /help pour voir les commandes disponibles.");
  }
});

// Gestion des erreurs de connexion
bot.on('webhook_error', (error) => {
  console.error(`Webhook error: ${error.code} - ${error.message}`);
});

// Gestion des erreurs de connexion à GitHub
octokit.hook.error('request', (error) => {
  console.error(`GitHub connection error: ${error.message}`);
});

console.log('Bot is running', new Date().toLocaleString());
