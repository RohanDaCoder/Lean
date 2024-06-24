const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("pet-pet")
    .setDescription("Pets a user's avatar.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to pet.")
        .setRequired(true),
    ),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      const user = interaction.options.getUser("user");
      const avatarUrl = user.displayAvatarURL({ extension: "png", size: 512 });
      const apiUrl = `https://api.popcat.xyz/pet?image=${encodeURIComponent(avatarUrl)}`;

      const embed = new EmbedBuilder()
        .setTitle(`${user.username} is getting petted!`)
        .setImage(apiUrl)
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error creating pet-pet animation:", error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while trying to create the pet-pet animation. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
