const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Clears a specified number of messages.')
    .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to clear').setRequired(false)),

  run: async ({ interaction }) => {
    const amount = interaction.options.getInteger('amount') || 50;

    if (amount <= 0 || amount > 100) {
      return interaction.reply({ content: 'You can only purge 1-100 messages at a time.', ephemeral: true });
    }

    try {
      const deletedMessages = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `Successfully deleted ${deletedMessages.size} messages.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to purge messages in this channel.', ephemeral: true });
    }
  },

  options: {
    userPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ['MANAGE_MESSAGES']
  }
};