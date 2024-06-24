const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Clears a specified number of messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to clear")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(300),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();

    const amount = interaction.options.getInteger("amount");
    const maxMessagesPerBatch = 100;
    let messagesToDelete = amount;

    try {
      let totalDeleted = 0;

      while (messagesToDelete > 0) {
        const currentBatchSize = Math.min(
          messagesToDelete,
          maxMessagesPerBatch,
        );
        const deletedMessages = await interaction.channel.bulkDelete(
          currentBatchSize,
          true,
        );
        totalDeleted += deletedMessages.size;
        messagesToDelete -= deletedMessages.size;

        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay between calls
      }

      await interaction.editReply({
        content: `${client.config.emojis.yes} Successfully deleted ${totalDeleted} messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: `${client.config.emojis.no} There was an error trying to purge messages in this channel. \n${error.message}`,
        ephemeral: true,
      });
    }
  },

  options: {
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageMessages"],
  },
};
