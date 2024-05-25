require("dotenv").config();
console.clear();
const {
  Client,
  GatewayIntentBits,
  WebhookClient,
  EmbedBuilder,
} = require("discord.js");
const Discord = require("discord.js");

const { CommandKit } = require("commandkit");
const config = require("./src/config.js");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

new CommandKit({
  client,
  ...config.CommandKit,
});

client.config = config;
process.client = client;
process.config = config;
process.discord = Discord;

client.login(process.env.TOKEN);
