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
        .setMaxValue(100),
    ),

  run: async ({ interaction }) => {
    const amount = interaction.options.getInteger("amount");
    try {
      const deletedMessages = await interaction.channel.bulkDelete(
        amount,
        true,
      );
      await interaction.reply({
        content: `Successfully deleted ${deletedMessages.size} messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error trying to purge messages in this channel.",
        ephemeral: true,
      });
    }
  },

  options: {
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageMessages"],
  },
};
