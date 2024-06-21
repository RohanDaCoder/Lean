const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Get the invite link to the bot's official server"),

  run: async ({ interaction, client }) => {
    const officialServerLink = `https://discord.com/invite/vCpBebaP8w`;

    const serverEmbed = new EmbedBuilder()
      .setTitle("Join My Official Server!")
      .setDescription(
        `[Click here to join the official server!](${officialServerLink})`,
      )
      .setColor("Random")
      .setTimestamp()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.deferReply({ ephemeral: true });

    try {
      await interaction.editReply({
        embeds: [serverEmbed],
        ephemeral: true,
      });
    } catch {
      await interaction.user.send({ embeds: [serverEmbed] });
      await interaction.editReply({
        content: "I've sent you a DM with the server invite link!",
      });
    }
  },
};
