require("dotenv/config");
const colors = require("colors");
console.clear();
const {
  Client,
  IntentsBitField,
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
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
});

new CommandKit({
  client,
  ...config.CommandKit,
});

const { GiveawaysManager } = require("./src/Util/GiveawayManager");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./src/Database/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#2F3136",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: `🛑 **Last chance to enter** 🛑`,
      threshold: 10000,
      embedColor: "#FF0000",
    },
  },
});

client.config = config;
process.client = client;
process.config = config;
process.discord = Discord;

client.login(process.env.TOKEN);

const botLogs = new Discord.WebhookClient({ url: process.env.botLogs });

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
    if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
    if(!error.stack) return
    const embed = new Discord.EmbedBuilder()
        .setTitle(`🚨・Unhandled promise rejection`)
        .addFields([
            {
                name: "Error",
                value: error ? Discord.codeBlock(error) : "No error",
            },
            {
                name: "Stack error",
                value: error.stack ? Discord.codeBlock(error.stack) : "No stack error",
            }
        ])
        .setColor("Red")
    botLogs.send({
        username: 'Bot Logs',
        avatar: client.user.displayAvatarURL(),
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending unhandledRejection to webhook')
        console.log(error)
    })
});

process.on('warning', warn => {
    console.warn("Warning:", warn);
    const embed = new Discord.EmbedBuilder()
        .setTitle(`🚨・New warning found`)
        .addFields([
            {
                name: `Warn`,
                value: `\`\`\`${warn}\`\`\``,
            },
        ])
        .setColor("Yellow")
    botLogs.send({
        username: 'Bot Logs',
        avatar: avatar: client.user.displayAvatarURL(),
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending warning to webhook')
        console.log(warn)
    })
});