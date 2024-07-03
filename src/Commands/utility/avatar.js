const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Show the avatar of a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user whose avatar you want to see.")
        .setRequired(false),
    ),

  run: async ({ client, interaction }) => {
    let user = interaction.options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setColor("Blurple")
      .setImage(user.displayAvatarURL({ dynamic: true }))
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.reply({ embeds: [embed] });
  },
  options: {
    botPermissions: ["EmbedLinks"],
  },
};
