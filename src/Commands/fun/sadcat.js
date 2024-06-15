const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sadcat")
    .setDescription("Creates a sad cat meme with custom text.")
    .addStringOption(option =>
      option.setName("text")
        .setDescription("Custom text for the sad cat meme.")
        .setRequired(true)
    ),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const text = interaction.options.getString("text");
      const apiUrl = `https://api.popcat.xyz/sadcat?text=${encodeURIComponent(text)}`;

      const embed = new EmbedBuilder()
        .setTitle("Sad Cat Meme")
        .setImage(apiUrl)
        .setColor('Random')
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed]
      });
    } catch (error) {
      console.error("Error creating sad cat meme:", error);
      await interaction.editReply({
        content: "An error occurred while trying to create the sad cat meme.",
        ephemeral: true
      });
    }
  }
};