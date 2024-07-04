require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");

const { CommandKit } = require("commandkit");

const config = require("./config.js");
const BotLogger = require("./Util/BotLogger");

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

const { GiveawaysManager } = require("./Util/GiveawayManager");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./Database/giveaways.json",
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
process.logger = BotLogger;

process.on("uncaughtException", (err) => {
  BotLogger.error({
    message: `Uncaught Exception: \n\`\`\`${err.message}\n\`\`\``,
    additionalInfo: `Stack Trace: \n\`\`\`${err.stack}\n\`\`\``,
  });
});

process.on("unhandledRejection", (reason, promise) => {
  BotLogger.error({
    message: `Unhandled Rejection: \n\`\`\`${reason}\n\`\`\``,
    additionalInfo: `Promise: \n\`\`\`${promise}\n\`\`\``,
  });
});

client.login(process.env.TOKEN);
