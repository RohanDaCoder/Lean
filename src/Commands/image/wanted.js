const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("wanted")
    .setDescription("Creates a wanted poster for a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to create the wanted poster for.")
        .setRequired(true),
    ),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const user = interaction.options.getUser("user");
      const avatarUrl = user.displayAvatarURL({ extension: "png", size: 512 });
      const apiUrl = `https://api.popcat.xyz/wanted?image=${encodeURIComponent(avatarUrl)}`;

      const embed = new EmbedBuilder()
        .setTitle(`${user.username} is wanted!`)
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error creating wanted poster:", error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while trying to create the wanted poster. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
