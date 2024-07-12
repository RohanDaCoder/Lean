const config = require("../../config");
const { EmbedBuilder } = require("discord.js");
const {
  isDM,
  isCooldownValid,
  isDevCommand,
  isBlacklisted,
} = require("../../Validations/validations");

module.exports = async (client, interaction) => {
  if (
    !interaction.isChatInputCommand() ||
    (await isDM({ client, interaction })) ||
    (await isDevCommand({ client, interaction })) ||
    (await isBlacklisted({ client, interaction })) ||
    (await isCooldownValid({ client, interaction }))
  ) return;

  const command = await client.commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({
      content: `${config.emojis.no} The specified command does not exist.`,
      ephemeral: true,
    });
  }

  try {
    await command.run({
      interaction,
      client,
    });
  } catch (error) {
    console.error(`Error While Running Command: \n${error}`);
    await interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${config.emojis.no} An error occurred while executing this command: \n${error.message}`,
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
