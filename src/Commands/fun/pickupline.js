const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pickup-line")
    .setDescription("Get a random pickup line."),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const apiUrl = "https://api.popcat.xyz/pickuplines";
      const response = await axios.get(apiUrl);
      const pickupLine = response.data.pickupline;

      await interaction.editReply({
        content: `💘 ${pickupLine}`,
      });
    } catch (error) {
      console.error("Error fetching pickup line:", error);
      await interaction.editReply({
        content: "An error occurred while fetching a pickup line.",
        ephemeral: true,
      });
    }
  },
};
