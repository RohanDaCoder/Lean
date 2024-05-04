const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge Messages (1 - 1000)")
    .addNumberOption((o) =>
      o.setName("purge-count")
      .setDescription("Amount Of Messages You Want To Purge")
      .setRequired(true)),
  run: async ({ client, interaction }) => {
    await interaction.deferReply()
    try {
      const amount = interaction.options.getNumber("amount");
      if (isNaN(amount) || amount < 1 || amount > 1000) {
        return await interaction.editReply({
          content: 'Please provide a valid amount of messages to delete (between 1 and 1000).',
          ephemeral: true
        });
      }

      const messages = await interaction.channel.messages.fetch({ limit: amount });
      await interaction.channel.bulkDelete(messages);

      const successMessage = await interaction.channel.send(`${interaction.user.tag} deleted \`${amount}\` messages.`);
      await successMessage.delete({ timeout: 5000 });
      return await interaction.editReply({
        content: `${interaction.user.tag} deleted \`${amount}\` messages.`,
        ephemeral: true
      });
    } catch (err) {
      console.error('Error clearing messages:', err);
      return await interaction.editReply({
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