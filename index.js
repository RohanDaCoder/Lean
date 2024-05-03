const { Client, GatewayIntentBits } = require('discord.js');
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

new CommandKit({
  client,
  commandsPath: path.join(__dirname, 'Commands'),
  eventsPath: path.join(__dirname, 'Events'),
  devGuildIds: ['964473061913030696'],
  devUserIds: ['92241943150893877'], //Write 3 At last
  bulkRegister: true
});

client.login(process.env.TOKEN);