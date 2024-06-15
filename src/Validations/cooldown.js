const path = require("path");
const Database = require("../Util/Database");

const cooldownsDBPath = path.join(__dirname, "../Database/cooldowns.json");
const cooldowns = new Database(cooldownsDBPath);
const config = require("../config.js");

function parseCooldown(cooldownString) {
  const regex = /(\d+)([smhdw])/;
  const match = cooldownString.match(regex);
  if (!match) return null;
  const value = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60000;
    case "h":
      return value * 3600000;
    case "d":
      return value * 86400000;
    case "w":
      return value * 604800000;
    default:
      return null;
  }
}

module.exports = async ({ interaction, commandObj }) => {
  const userID = interaction.user.id;
  const cooldownKey = `${userID}-${commandObj.data.name}`;
  const cooldownString = commandObj.options?.cooldown || "3s";
  const cooldownTime = parseCooldown(cooldownString);

  if (!cooldownTime) {
    console.error("Invalid cooldown time format:", cooldownString);
    return true;
  }

  const now = Date.now();
  const cooldownExpiration = await cooldowns.get(cooldownKey);

  if (cooldownExpiration && cooldownExpiration > now) {
    const remainingTime = cooldownExpiration - now;
    const { default: prettyMS } = await import("pretty-ms");
    const prettyRemainingTime = prettyMS(remainingTime, { verbose: true });
    interaction.reply({
      content: `You're on cooldown. Please wait ${prettyRemainingTime} before running ${commandObj.data.name} command again.`,
      ephemeral: true,
    });
    return true;
  }

  await cooldowns.set(cooldownKey, now + cooldownTime);

  if (cooldownExpiration && cooldownExpiration <= now) {
    await cooldowns.delete(cooldownKey);
  }
};