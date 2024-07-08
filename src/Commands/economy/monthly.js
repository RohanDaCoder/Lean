const { SlashCommandBuilder } = require("discord.js");
const eco = require("../../Util/EconomyManager.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("monthly")
    .setDescription("Claim Your Monthly Coins"),
  options: {
    cooldown: "1M",
  },
  run: async ({ client, interaction }) => {
    try {
      const userID = interaction.user.id;
      const reward = client.config.rewards.monthly;
      const currentBalance = await eco.GetMoney({ userID, balance: "wallet" });

      await interaction.reply({
        content: `${client.config.emojis.yes} Congratulations! You claimed ${eco.formatMoney(reward)} as your monthly reward.`,
      });

      await eco.SetMoney({
        userID,
        balance: "wallet",
        amount: currentBalance.raw + reward,
      });
    } catch (error) {
      console.error("Error claiming monthly reward:", error);
      await interaction.reply({
        content: `${client.config.emojis.no} An error occurred while claiming your monthly reward. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
