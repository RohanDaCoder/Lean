const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("oogway")
    .setDescription("Get a wisdom quote from Master Oogway.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Customize the quote with additional text.")
        .setRequired(true),
    ),

  async run({ interaction }) {
    try {
      const text = encodeURIComponent(interaction.options.getString("text"));
      const apiUrl = `https://api.popcat.xyz/oogway?text=${text}`;

      const embed = new EmbedBuilder()
        .setTitle("Master Oogway's Wisdom")
        .setColor("#FFD700")
        .setImage(apiUrl)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching Oogway quote:", error);
      await interaction.reply({
        content: "An error occurred while fetching Master Oogway's wisdom.",
        ephemeral: true,
      });
    }
  },
};
