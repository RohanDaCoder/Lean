const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whowouldwin")
    .setDescription(
      "Creates a 'Who would win?' meme with the avatars of two users.",
    )
    .addUserOption((option) =>
      option
        .setName("user1")
        .setDescription("The first user.")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName("user2")
        .setDescription("The second user.")
        .setRequired(true),
    ),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const user1 = interaction.options.getUser("user1");
      const user2 = interaction.options.getUser("user2");
      const avatar1 = user1.displayAvatarURL({ extension: "png", size: 512 });
      const avatar2 = user2.displayAvatarURL({ extension: "png", size: 512 });
      const apiUrl = `https://api.popcat.xyz/whowouldwin?image1=${encodeURIComponent(avatar1)}&image2=${encodeURIComponent(avatar2)}`;

      const embed = new EmbedBuilder()
        .setTitle("Who Would Win?")
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error creating 'Who would win?' meme:", error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while trying to create the 'Who would win?' meme. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
  options: {
    botPermissions: ["EmbedLinks"],
  },
};
