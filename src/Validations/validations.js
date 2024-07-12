const isCooldownValid = require("./cooldown");
const isDevCommand = require("./devOnly");
const isDM = require("./isDM");
const isBlacklisted = require("./isBlacklisted");
module.exports = {
  isCooldownValid,
  isDevCommand,
  isDM,
  isBlacklisted,
};
