const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("bidenpost")
    .setDescription("Make Biden Post Something On Twitter With A Custom Text")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text for the Biden Twitter post meme.")
        .setRequired(true),
    ),

  async run({ interaction, client }) {
    try {
      await interaction.deferReply();

      const text = interaction.options.getString("text");
      const apiUrl = `https://api.popcat.xyz/biden?text=${encodeURIComponent(text)}`;

      const embed = new EmbedBuilder()
        .setTitle("Biden Twitter Post Meme")
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error creating Biden Twitter post meme:", error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while trying to create the Biden Twitter post meme. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
