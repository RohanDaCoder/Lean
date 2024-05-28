require("dotenv/config");
const colors = require("colors");
console.clear();
const {
  Client,
  GatewayIntentBits,
  WebhookClient,
  EmbedBuilder,
  Partials,
} = require("discord.js");
const Discord = require("discord.js");

const { CommandKit } = require("commandkit");

const config = require("./src/config.js");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
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
