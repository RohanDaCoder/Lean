const path = require("path");
const Database = require("calm.db");
const config = require("../config");
const cooldownsDBPath = path.join(__dirname, "../Database/cooldowns.json");
const cooldowns = new Database(cooldownsDBPath);

function parseCooldown(cooldownString) {
  const regex = /(\d+)([smhdwM])/;
  const match = cooldownString.match(regex);
  if (!match) {
    return null;
  }
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
    case "M":
      return value * 2.592e9;
    default:
      return null;
  }
}

module.exports = async ({ interaction, client }) => {
  const commandObj = await client.commands.get(interaction.commandName);

  const userID = interaction.user.id;
  const cooldownKey = `${userID}-${commandObj.data.name}`;
  const cooldownString = commandObj.options?.cooldown || "3s";
  const cooldownTime = parseCooldown(cooldownString);

  if (!cooldownTime) {
    return false;
  }

  const now = Date.now();
  const cooldownExpiration = await cooldowns.get(cooldownKey);

  if (cooldownExpiration && cooldownExpiration > now) {
    const { default: prettyMS } = await import("pretty-ms");
    const remainingTime = cooldownExpiration - now;
    const prettyRemainingTime = prettyMS(remainingTime, { verbose: true });
    await interaction.channel.send({
      content: `${config.emojis.no} You are currently on cooldown. Please wait **${prettyRemainingTime}** before using the \`/${commandObj.data.name}\` command again.`,
      ephemeral: true,
    });
    return true;
  }

  await cooldowns.set(cooldownKey, now + cooldownTime);

  if (cooldownExpiration && cooldownExpiration <= now) {
    await cooldowns.delete(cooldownKey);
  }

  return false;
};
