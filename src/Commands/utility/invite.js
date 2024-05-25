const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the bot's invite link"),

  run: async ({ interaction, client }) => {
    const permissions = "1239568215286"; // Provided permissions bit
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot`;

    const inviteEmbed = new EmbedBuilder()
      .setTitle("Invite Me!")
      .setDescription(
        `[Click here to invite me to your server!](${inviteLink})`,
      )
      .setColor("Random")
      .setTimestamp()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.deferReply({ ephemeral: true });

    try {
      // Attempt to DM the user
      await interaction.user.send({ embeds: [inviteEmbed] });
      await interaction.editReply({
        content: "I've sent you a DM with the invite link!",
      });
    } catch {
      // Send the embed in the channel if DM fails
      await interaction.editReply({
        content: "I couldn't DM you the invite link. Here it is:",
        embeds: [inviteEmbed],
      });
    }
  },
};
