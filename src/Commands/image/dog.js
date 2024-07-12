const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Fetch a random dog picture"),

  async run({ interaction }) {
    await interaction.deferReply();

    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    const dogImageUrl = response.data.message;

    const dogEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Random Dog Picture")
      .setImage(dogImageUrl)
      .setTimestamp();

    await interaction.editReply({ embeds: [dogEmbed] });
  },
};
