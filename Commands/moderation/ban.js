const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'ban',
    description: 'Ban a member from the server.',
  },

  run: async ({ client, interaction }) => {
    let target = interaction.options.getMentionable("target");
    let reason = interaction.options.getString("reason") || 'No Reason Specified.';

    target.ban().catch((err) => {
      interaction.reply(`:x: Something went wrong while banning ${target.user.tag}`);
      console.log(err);
    });

    const banEmbed = new EmbedBuilder()
      .setTitle('Ban')
      .setDescription(`${target} successfully banned ${target.user.tag}`)
      .addField('Banned By', `${interaction.user.tag}`)
      .addField('Reason', `${reason}`)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setColor('GREEN');

    await interaction.reply({ embeds: [banEmbed] });
  },

  options: {
    devOnly: false,
    userPermissions: ['BAN_MEMBERS'],
    botPermissions: ['BAN_MEMBERS'],
    deleted: false,
  },
};