const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to ban")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for banning the user")
        .setRequired(false),
    ),

  run: async ({ interaction, client }) => {
    const userToBan = interaction.options.getMember("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!userToBan.bannable) {
      return interaction.reply({
        content: `${client.config.emojis.no} I cannot ban this user.`,
        ephemeral: true,
      });
    }

    try {
      await userToBan.ban({ reason: reason });

      const banEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("User Banned")
        .addFields(
          { name: "Banned User", value: userToBan.user.tag, inline: true },
          { name: "Banned By", value: interaction.user.tag, inline: true },
          { name: "Reason", value: reason },
        )
        .setTimestamp()
        .setFooter({
          text: `User ID: ${userToBan.id}`,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.reply({ embeds: [banEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `${client.config.emojis.no} An Error Occured When Banning ${userToBan.user.tag} \n${error.message}`,
        ephemeral: true,
      });
    }
  },

  options: {
    devOnly: false,
    userPermissions: ["BanMembers"],
    botPermissions: ["BanMembers"],
  },
};
