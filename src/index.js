/* eslint-disable no-console */
require("dotenv").config();
const mongoose = require("mongoose");
const { Client, IntentsBitField, Collection } = require("discord.js");
const config = require("./config.js");
const BotLogger = require("./Util/BotLogger");
const color = require("colors");
const path = require("path");
const fs = require("fs");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
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
    console.log(color.green(`[Database] Connected To MongoDB`));
    client.login(process.env.TOKEN);
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));

//Load Events
try {
  const eventNames = fs.readdirSync(path.resolve(__dirname, "./Events"));

  eventNames.forEach(async (name) => {
    const eventFiles = fs.readdirSync(
      path.resolve(__dirname, `./Events/${name}`),
    );

    eventFiles.forEach(async (eventFile) => {
      const runEvent = require(`./Events/${name}/${eventFile}`);
      client.on(name, (...props) => runEvent(client, ...props));
    });
  });
} catch (error) {
  console.error("Error loading events:", error);
}