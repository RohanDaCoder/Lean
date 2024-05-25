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
  usageLogChannel: "Usage Logger",
  CommandKit: {
    commandsPath: path.join(__dirname, "Commands"),
    eventsPath: path.join(__dirname, "Events"),
    validationsPath: path.join(__dirname, "Validations"),
    devGuildIds: ["Dev Guild Ids"],
    devUserIds: ["Dev Ids"],
    bulkRegister: true,
  },
};
