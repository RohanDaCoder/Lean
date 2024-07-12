const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Fetch a random cat picture"),

  async run({ interaction }) {
    await interaction.deferReply();

    const response = await axios.get(
      "https://api.thecatapi.com/v1/images/search",
    );
    const catImageUrl = response.data[0].url;

    const catEmbed = new EmbedBuilder()
      .setColor(0xffa500)
      .setTitle("Random Cat Picture")
      .setImage(catImageUrl)
      .setTimestamp();

    await interaction.editReply({ embeds: [catEmbed] });
  },
};
