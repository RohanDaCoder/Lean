const { SlashCommandBuilder } = require("discord.js");
const eco = require("../../Util/EconomyManager.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weekly")
    .setDescription("Claim Your Weekly Coins"),
  options: {
    cooldown: "1w",
  },
  run: async ({ client, interaction }) => {
    try {
      const userID = interaction.user.id;
      const reward = client.config.rewards.weekly;
      const currentBalance = await eco.GetMoney({ userID, balance: "wallet" });

      await interaction.reply({
        content: `${client.config.emojis.yes} Congratulations! You claimed ${eco.formatMoney(reward)} as your weekly reward.`,
      });

      await eco.SetMoney({
        userID,
        balance: "wallet",
        amount: currentBalance.raw + reward,
      });
    } catch (error) {
      console.error("Error claiming weekly reward:", error);
      await interaction.reply({
        content: `${client.config.emojis.no} An error occurred while claiming your weekly reward. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
