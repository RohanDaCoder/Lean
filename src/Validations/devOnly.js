const config = require("../config");

module.exports = async ({ client, interaction }) => {
  const cmd = client.commands.get(interaction.commandName);
  if (
    !config.devUserIds ||
    !config.devGuildIds ||
    !cmd.data ||
    !cmd.options.devOnly
  )
    return false;

  const guild = await client.guilds.fetch(interaction.guildId);
  if (!cmd.options.devOnly || !config.devGuildIds.includes(guild.id)) {
    await interaction.reply({
      content: `${config.emojis.no} This command is restricted to developer servers only.`,
    });
    return true;
  }

  if (!config.devUserIds.includes(interaction.user.id)) {
    await interaction.reply({
      content: `${config.emojis.no} This command is restricted to developers only.`,
    });
    return true;
  }

  return false;
};
