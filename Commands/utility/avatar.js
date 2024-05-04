const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show the avatar of a user.')
    .addUserOption(option =>
      option.setName('user')
      .setDescription('The user whose avatar you want to see.')
      .setRequired(false)),

  run: async ({ client, interaction, Discord }) => {
    let user = interaction.options.getUser('user');

    if (!user) {
      user = interaction.user;
    }

    const embed = new Discord.EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setColor('Blurple')
      .setImage(user.defaultAvatarURL({ dynamic: true }));

    await interaction.reply({ embeds: [embed] });
  },
};