const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("mnm")
    .setDescription("Creates an M&M meme with a user's avatar.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to create the M&M meme for.")
        .setRequired(true),
    ),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const user = interaction.options.getUser("user");
      const avatarUrl = user.displayAvatarURL({ extension: "png", size: 512 });
      const apiUrl = `https://api.popcat.xyz/mnm?image=${encodeURIComponent(avatarUrl)}`;

      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s M&M Meme`)
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error creating M&M meme:", error);
      await interaction.editReply({
        content: "An error occurred while trying to create the M&M meme.",
        ephemeral: true,
      });
    }
  },
};
