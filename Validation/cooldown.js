const cooldowns = new Map();
function parseCooldown(cooldownString) {
  const regex = /(\d+)([smhdw])/;
  const match = cooldownString.match(regex);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000; // seconds
    case "m":
      return value * 60000; // minutes
    case "h":
      return value * 3600000; // hours
    case "d":
      return value * 86400000; // days
    case "w":
      return value * 604800000; // weeks
    default:
      return null;
  }
}

module.exports = async ({ interaction, commandObj }) => {
  const userID = interaction.user.id;
  if (process.config.devIDs.includes(userID)) return false;
  const cooldownKey = `${userID}-${commandObj.data.name}`;
  const cooldownString = commandObj.options?.cooldown || "3s";
  const cooldownTime = parseCooldown(cooldownString);

  if (!cooldownTime) {
    console.error("Invalid cooldown time format:", cooldownString);
    return true; // Invalid cooldown time format, stop command execution
  }

  if (cooldowns.has(cooldownKey) && cooldowns.get(cooldownKey) > Date.now()) {
    const remainingTime = cooldowns.get(cooldownKey) - Date.now();
    const { default: prettyMS } = await import("pretty-ms");
    const prettyRemainingTime = prettyMS(remainingTime, { verbose: true });
    interaction.reply({
      content: `You're on cooldown. Please wait ${prettyRemainingTime} before running ${commandObj.data.name} command again.`,
      ephemeral: true,
    });
    return true;
  }

  cooldowns.set(cooldownKey, Date.now() + cooldownTime);
  return false;
};
