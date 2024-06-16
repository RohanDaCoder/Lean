const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("iphone-alert")
    .setDescription("Creates an iPhone alert meme with your text.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to display in the alert.")
        .setRequired(true),
    ),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const text = interaction.options.getString("text");
      const apiUrl = `https://api.popcat.xyz/alert?text=${encodeURIComponent(text)}`;

      const embed = new EmbedBuilder()
        .setTitle("iPhone Alert Meme")
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error creating iPhone alert meme:", error);
      await interaction.editReply({
        content:
          "An error occurred while trying to create the iPhone alert meme.",
        ephemeral: true,
      });
    }
  },
};
