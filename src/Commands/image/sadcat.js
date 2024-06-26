const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("sadcat")
    .setDescription("Creates a sad cat meme with custom text.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Custom text for the sad cat meme.")
        .setRequired(true),
    ),

  async run({ interaction, client }) {
    try {
      await interaction.deferReply();

      const text = interaction.options.getString("text");
      const apiUrl = `https://api.popcat.xyz/sadcat?text=${encodeURIComponent(text)}`;

      const embed = new EmbedBuilder()
        .setTitle("Sad Cat Meme")
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error creating sad cat meme:", error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while trying to create the sad cat meme. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
