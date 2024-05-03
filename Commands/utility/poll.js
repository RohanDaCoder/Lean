module.exports = {
  data: {
    name: 'poll',
    description: 'Create a poll.',
  },

  run: async ({ client, interaction }) => {
    const { EmbedBuilder } = require('discord.js');

    const sentence = interaction.options.getString("question");

    interaction.reply({
      content: `:x: Successfully created poll.`,
      ephemeral: true
    });

    const pollEmbed = new EmbedBuilder()
      .setTitle('**Poll**')
      .setDescription(`**${interaction.user.username}** Asks: **${sentence}**`)
      .setColor('BLURPLE');

    interaction.channel.send({ embeds: [pollEmbed] })
      .then(msg => {
        msg.react("<a:pollYes:1006899660482416761>");
        msg.react("<a:pollNo:1006899793789997076>");
      });
  },

  options: {
    devOnly: false,
    userPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ['MANAGE_MESSAGES', 'ADD_REACTIONS'],
    deleted: false,
  },
};