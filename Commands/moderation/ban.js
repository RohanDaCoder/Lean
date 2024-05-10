const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server.')
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user to ban')
      .setRequired(true))
    .addStringOption(option => option
      .setName('reason')
      .setDescription('Reason for banning the user')
      .setRequired(false)),

  run: async ({ interaction, client }) => {
    const userToBan = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    if (!userToBan.bannable) {
      return interaction.reply({ content: "I cannot ban this user.", ephemeral: true });
    }

    try {
      await userToBan.ban({ reason: reason });

      const banEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('User Banned')
        .addFields(
          { name: 'Banned User', value: userToBan.user.tag, inline: true },
          { name: 'Banned By', value: interaction.user.tag, inline: true },
          { name: 'Reason', value: reason }
        )
        .setTimestamp()
        .setFooter({ text: `User ID: ${userToBan.id}`, iconURL: interaction.guild.iconURL() });

      await interaction.reply({ embeds: [banEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `Failed to ban: ${error.message}`, ephemeral: true });
    }
  },

  options: {
    devOnly: false,
    userPermissions: ['BAN_MEMBERS'],
    botPermissions: ['BAN_MEMBERS']
  }
};