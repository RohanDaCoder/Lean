const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("poohmeme")
    .setDescription("Creates a Pooh meme with custom texts.")
    .addStringOption((option) =>
      option
        .setName("text1")
        .setDescription("First text for the meme.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("text2")
        .setDescription("Second text for the meme.")
        .setRequired(true),
    ),

  async run({ interaction, client }) {
    try {
      await interaction.deferReply();

      const text1 = interaction.options.getString("text1");
      const text2 = interaction.options.getString("text2");
      const apiUrl = `https://api.popcat.xyz/pooh?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;

      const embed = new EmbedBuilder()
        .setTitle("Pooh Meme")
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error creating Pooh meme:", error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while trying to create the Pooh meme. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
