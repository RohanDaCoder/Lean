const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("fact")
    .setDescription("Get a random fact."),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const response = await axios.get("https://api.popcat.xyz/fact");
      const fact = response.data.fact;

      const embed = new EmbedBuilder()
        .setTitle("Random Fact")
        .setDescription(fact)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error fetching fact:", error);
      await interaction.editReply({
        content: "An error occurred while trying to fetch a fact.",
        ephemeral: true,
      });
    }
  },
};
