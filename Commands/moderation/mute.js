const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'mute',
    description: 'Mute a member from the server.',
  },

  run: async ({ client, interaction }) => {
    let target = interaction.options.getMentionable("target");
    let reason = interaction.options.getString("reason") || 'No Reason Specified.';

    target.timeout().catch((err) => {
      interaction.reply(`:x: Something went wrong while muting ${target.user.tag}`);
      console.log(err);
    });

    const muteEmbed = new EmbedBuilder()
      .setTitle('Mute')
      .setDescription(`${target} successfully muted ${target.user.tag}`)
      .addField('Muted By', `${interaction.user.tag}`)
      .addField('Reason', `${reason}`)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setColor('GREEN');

    await interaction.reply({ embeds: [muteEmbed] });
  },

  options: {
    devOnly: false,
    userPermissions: ['MUTE_MEMBERS'],
    botPermissions: ['MUTE_MEMBERS'],
    deleted: false,
  },
};