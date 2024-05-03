module.exports = {
  data: {
    name: 'clear',
    description: 'Clear Messages',
  },

  run: async ({ client, interaction }) => {
    try {
      const amount = interaction.options.getNumber("amount");
      if (isNaN(amount) || amount < 1 || amount > 1000) {
        return await interaction.reply({
          content: 'Please provide a valid amount of messages to delete (between 1 and 1000).',
          ephemeral: true
        });
      }

      const messages = await interaction.channel.messages.fetch({ limit: amount });
      await interaction.channel.bulkDelete(messages);

      const successMessage = await interaction.channel.send(`${interaction.user.tag} deleted \`${amount}\` messages.`);
      await successMessage.delete({ timeout: 5000 });
      return await interaction.reply({
        content: `${interaction.user.tag} deleted \`${amount}\` messages.`,
        ephemeral: true
      });
    } catch (err) {
      console.error('Error clearing messages:', err);
      return await interaction.reply({
        content: `:x: Something went wrong. Please try again later.`,
        ephemeral: true
      });
    }
  },

  options: {
    devOnly: false,
    userPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ['MANAGE_MESSAGES'],
    deleted: false,
  },
};