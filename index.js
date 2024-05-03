const { Client, GatewayIntentBits } = require('discord.js');
const { CommandKit } = require('commandkit');
const config = require("./config.js")
const client = new Client({
  intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

new CommandKit(config.CommandKit);

client.login(process.env.TOKEN);