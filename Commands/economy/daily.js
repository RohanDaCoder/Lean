const { SlashCommandBuilder } = require("discord.js");
const EconomyManager = require("../../Util/EconomyManager");

const economyManager = new EconomyManager();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim Your Daily Coins"),
  run: async ({ client, interaction }) => {
    try {
      await interaction.deferReply();

      const userId = interaction.user.id;

      // Check if user has already claimed daily
      const result = await economyManager.daily(userId, 500);
      if (result.cooldown) {
        await interaction.editReply({
          content: `You have already claimed your daily coins. Please wait ${result.time.hours} hours and ${result.time.minutes} minutes before claiming again.`,
        });
        return;
      }

      // Send confirmation message
      await interaction.editReply({
        content:
          "You have successfully claimed your daily coins! 500 coins have been added to your wallet.",
      });
    } catch (error) {
      console.error("Error claiming daily coins:", error.message);
      await interaction.editReply({
        content: `An error occurred while claiming your daily coins: ${error.message}`,
      });
    }
  },
};
