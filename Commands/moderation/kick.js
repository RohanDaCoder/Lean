const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'kick',
    description: 'Kick a member from the server.',
  },

  run: async ({ client, interaction }) => {
    let target = interaction.options.getMentionable("target");
    let reason = interaction.options.getString("reason") || 'No Reason Specified.';

    target.kick().catch((err) => {
      interaction.reply(`:x: Something went wrong while kicking ${target.user.tag}`);
      console.log(err);
    });

    const kickEmbed = new EmbedBuilder()
      .setTitle('Kick')
      .setDescription(`${target} successfully kicked ${target.user.tag}`)
      .addField('Kicked By', `${interaction.user.tag}`)
      .addField('Reason', `${reason}`)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setColor('GREEN');

    await interaction.reply({ embeds: [kickEmbed] });
  },

  options: {
    devOnly: false,
    userPermissions: ['BAN_MEMBERS'],
    botPermissions: ['BAN_MEMBERS'],
    deleted: false,
  },
};