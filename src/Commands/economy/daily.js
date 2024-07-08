const { SlashCommandBuilder } = require("discord.js");
const eco = require("../../Util/EconomyManager.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim Your Daily Coins"),
  options: {
    cooldown: "1d",
  },
  run: async ({ client, interaction }) => {
    try {
      const userID = interaction.user.id;
      const reward = client.config.rewards.daily;
      const currentBalance = await eco.GetMoney({ userID, balance: "wallet" });

      await interaction.reply({
        content: `${client.config.emojis.yes} Congratulations! You claimed ${eco.formatMoney(reward)} as your daily reward.`,
      });

      await eco.SetMoney({
        userID,
        balance: "wallet",
        amount: currentBalance.raw + reward,
      });
    } catch (error) {
      console.error("Error claiming daily reward:", error);
      await interaction.reply({
        content: `${client.config.emojis.no} An error occurred while claiming your daily reward. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
