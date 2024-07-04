const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("drake")
    .setDescription("Generate a Drake meme.")
    .addStringOption((option) =>
      option
        .setName("disagree")
        .setDescription("The text for the 'disagree' part of the meme")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("agree")
        .setDescription("The text for the 'agree' part of the meme")
        .setRequired(true),
    ),

  async run({ interaction, client }) {
    const disagree = interaction.options.getString("disagree");
    const agree = interaction.options.getString("agree");

    try {
      await interaction.deferReply();
      const imageUrl = `https://api.popcat.xyz/drake?text1=${encodeURIComponent(disagree)}&text2=${encodeURIComponent(agree)}`;

      const embed = new EmbedBuilder()
        .setTitle("Drake Meme")
        .setImage(imageUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error generating Drake meme:", error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while trying to generate the Drake meme. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
