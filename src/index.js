require("dotenv").config();
const mongoose = require("mongoose");
const { Client, IntentsBitField } = require("discord.js");
const { CommandKit } = require("commandkit");
const config = require("./config.js");
const BotLogger = require("./Util/BotLogger");
const { green } = require("colors");
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

const { GiveawaysManager } = require("./Util/GiveawayManager");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: path.resolve("./src/Database/giveaways.json"),
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
  console.error(err);
  BotLogger.error({
    message: `Uncaught Exception: \n\`\`\`${err.message}\n\`\`\``,
    additionalInfo: `Stack Trace: \n\`\`\`${err.stack}\n\`\`\``,
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(reason.code);
  console.error(reason);
  BotLogger.error({
    message: `Unhandled Rejection: \n\`\`\`${reason}\n\`\`\``,
    additionalInfo: `Promise: \n\`\`\`${promise}\n\`\`\``,
  });
});

mongoose
  .connect(process.env.mongoDB)
  .then(() => {
    /* eslint-disable-next-line no-console */
    console.log(green(`[Database] Connected To MongoDB`));
    client.login(process.env.TOKEN);
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
