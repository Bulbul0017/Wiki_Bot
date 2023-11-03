const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Set up for bot 
const botToken = 'INSERT BOT TOKEN';
const chatId = 'INSERT GROUP CHAT ID'; 

// Initialize bot
const bot = new TelegramBot(botToken, { polling: true });

// fetch a random Wikipedia article title
async function getRandomWikiTitle() {
  try {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'random',
        rnnamespace: 0,
        format: 'json',
      },
    });
    const randomArticle = response.data.query.random[0];
    return randomArticle.title;
  } catch (error) {
    console.error('Error fetching random Wikipedia article:', error.message);
    return null;
  }
}

// fetch the summary of a Wikipedia article
async function getWikiSummary(articleTitle) {
  try {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        prop: 'extracts',
        exintro: true,
        explaintext: true,
        titles: articleTitle,
        format: 'json',
      },
    });
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const summary = pages[pageId].extract;
    return summary;
  } catch (error) {
    console.error('Error fetching Wikipedia article summary:', error.message);
    return null;
  }
}

// send random Wikipedia article summary to Telegram
async function sendRandomWikiToTelegram() {
  const articleTitle = await getRandomWikiTitle();
  if (!articleTitle) return;

  const summary = await getWikiSummary(articleTitle);
  if (!summary) return;

  const message = `Random Wikipedia Article: ${articleTitle}\n\n${summary}`;

  // Send to Telegram group
  bot.sendMessage(chatId, message);
}
// final call
sendRandomWikiToTelegram();