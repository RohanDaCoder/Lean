const config = require("../../config");
const checkValidations = require("../../Util/checkValidations");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.inGuild() === false)
    return interaction.reply({
      content: `${config.emojis.no} Please Use My Commands In A Server And Not In a DM!`,
    });
  if (config.blacklistedUsers?.includes(interaction.user.id))
    return interaction.reply({
      content: `${config.emojis.no} You Have Been Blacklisted From Using ${client.user.name}.`,
      ephemeral: true,
    });
  const command = await client.commands.get(interaction.commandName);
  if (!command)
    return interaction.reply({
      content: `${config.emojis.no} That Command Doesnt Exist.`,
      ephemeral: true,
    });

  try {
    await checkValidations(client, interaction, command.run);
  } catch (error) {
    console.error(`Error While Running Command: \n${error}`);
    await interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${config.emojis.no} There was an error while executing this command! \n${error.message}`,
          )
          .setColor("Red")
          .setFooter({
            text: `Requested By ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: false }),
          }),
      ],
    });
  }
};
