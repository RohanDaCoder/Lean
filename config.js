const path = require("path");

module.exports = {
   emojis: {
      money: "<:money:1239220215234166804>",
   },
   rewards: {
      daily: 500,
      weekly: 5000,
      monthly: 10000,
   },
   usageLogChannel: "1132214287688011886",
   CommandKit: {
      commandsPath: path.join(__dirname, "Commands"),
      eventsPath: path.join(__dirname, "Events"),
      validationsPath: path.join(__dirname, "Validations"),
      devGuildIds: ["1101454417586294854"],
      devUserIds: ["922419431508938773"],
      bulkRegister: true,
   }
};