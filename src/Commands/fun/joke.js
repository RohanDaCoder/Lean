const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Fetches a random joke from the PopCat API."),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const response = await axios.get("https://api.popcat.xyz/joke");
      const joke = response.data.joke;

      const jokeEmbed = new EmbedBuilder()
        .setTitle("Here's a joke for you!")
        .setDescription(joke)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [jokeEmbed],
      });
    } catch (error) {
      console.error("Error fetching joke:", error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while fetching a joke. Please try again later. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
