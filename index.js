require("dotenv").config();
console.clear();
const { Client, GatewayIntentBits, WebhookClient, EmbedBuilder } = require('discord.js');
const { CommandKit } = require('commandkit');
const config = require("./config.js");
const path = require("path");

const client = new Client({
  intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.config = config;
process.client = client;

new CommandKit({
  client,
  commandsPath: path.join(__dirname, 'Commands'),
  eventsPath: path.join(__dirname, 'Events'),
  devGuildIds: ['964473061913030696'],
  devUserIds: ['922419431508938773'],
  bulkRegister: true
});

client.login(process.env.TOKEN);

// Create a webhook client with the webhook URL
const webhook = new WebhookClient({ url: process.env.errorhook });

// Function to send error embed to Discord webhook
const sendErrorEmbed = (errorType, error) => {
  const errorEmbed = new EmbedBuilder()
    .setTitle(`Error: ${errorType}`)
    .setColor('Red')
    .setTimestamp();

  // Check if the error object exists
  if (error) {
    errorEmbed.setDescription(error.toString());
    if (error.message) {
      errorEmbed.addFields({
        name: 'Message',
        value: error.message
      });
    }
    if (error.stack) {
      errorEmbed.addFields({
        name: 'Stack Trace',
        value: `\`\`\`${error.stack}\`\`\``
      });
    }
  } else {
    // If error object is undefined, set description accordingly
    errorEmbed.setDescription('An unknown error occurred.');
  }

  // Send the error embed to the webhook
  webhook.send({ embeds: [errorEmbed] })
    .catch(console.error);
};

// Listen for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Promise Rejection:', reason);
  sendErrorEmbed('Unhandled Promise Rejection', reason);
});

// Listen for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception:', error);
  sendErrorEmbed('Uncaught Exception', error);
});

// Listen for multiple resolves
process.on('multipleResolves', (type, promise, reason) => {
  console.log('Multiple Resolves:', type, reason);
});