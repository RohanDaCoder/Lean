const config = require("../../config");

module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  if (config.blacklistedUsers?.includes(interaction.user.id))
    return interaction.reply({
      content: `${config.emojis.no} You Have Been Blacklisted From Using ${client.user.name}.`,
      ephemeral: true,
    });
  const command = client.commands.get(interaction.commandName);
  if (!command)
    return interaction.reply({
      content: `${config.emojis.no} That Command Doesnt Exist.`,
      ephemeral: true,
    });

  try {
    await command.run({ interaction, client });
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: `${config.emojis.no} There was an error while executing this command! \n${error.message}`,
      ephemeral: true,
    });
  }
};
