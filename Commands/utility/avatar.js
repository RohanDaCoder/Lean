module.exports = {
  data: {
    name: 'avatar',
    description: 'Show the avatar of a user.',
  },

  run: async ({ client, interaction, Discord }) => {
    const user = interaction.options.get('user');
    const embed = new Discord.EmbedBuilder()
      .setTitle(`${user.user.tag}`)
      .setColor('BLURPLE')
      .setImage(user.user.displayAvatarURL({ dynamic: true }));
   
    await interaction.reply({ embeds: [embed] });
  },
};