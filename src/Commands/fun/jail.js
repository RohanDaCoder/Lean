const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("Puts a user behind bars.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to put behind bars.")
        .setRequired(true),
    ),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const user = interaction.options.getUser("user");
      const avatarUrl = user.displayAvatarURL({ format: "png", size: 512 });
      const apiUrl = `https://api.popcat.xyz/jail?image=${encodeURIComponent(avatarUrl)}`;

      const embed = new EmbedBuilder()
        .setTitle(`${user.username} is in jail!`)
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error creating jail image:", error);
      await interaction.editReply({
        content: "An error occurred while trying to put the user in jail.",
        ephemeral: true,
      });
    }
  },
};
