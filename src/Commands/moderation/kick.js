const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kicking the user")
        .setRequired(false),
    ),

  run: async ({ interaction, client }) => {
    const userToKick = interaction.options.getMember("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!userToKick.kickable) {
      return interaction.reply({
        content: `${client.config.emojis.no} I cannot kick this user.`,
        ephemeral: true,
      });
    }

    try {
      await userToKick.kick(reason);

      const kickEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("User Kicked")
        .addFields(
          { name: "Kicked User", value: userToKick.user.tag, inline: true },
          { name: "Kicked By", value: interaction.user.tag, inline: true },
          { name: "Reason", value: reason },
        )
        .setTimestamp()
        .setFooter({
          text: `User ID: ${userToKick.id}`,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.reply({ embeds: [kickEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `${client.config.emojis.no} An Error Occured When Kicking ${userToKick.user.tag}  \n${error.message}`,
        ephemeral: true,
      });
    }
  },

  options: {
    devOnly: false,
    userPermissions: ["KickMembers"],
    botPermissions: ["KickMembers"],
  },
};
