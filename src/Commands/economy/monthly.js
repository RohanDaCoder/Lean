const { SlashCommandBuilder } = require("discord.js");

const eco = require("../../Util/EconomyManager.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("monthly")
    .setDescription("Claim Your Monthly Coins"),
  options: {
    cooldown: "1M", // 1 month cooldown
  },
  run: async ({ client, interaction }) => {
    try {
      const userID = interaction.user.id;
      const { db } = await eco.GetProfile(userID);
      const check = db.get("monthly");
      if (check) {
        await interaction.reply({
          content: `${client.config.emojis.no} You have already claimed your monthly prize.`,
          ephemeral: true,
        });
        return;
      } else {
        const reward = client.config.rewards.monthly;
        const currentBalance = await eco.GetMoney({
          userID,
          balance: "wallet",
        });
        await interaction.reply({
          content: `${client.config.emojis.yes} Congratulations! You claimed ${eco.formatMoney(reward)} as your monthly reward.`,
        });
        db.set("wallet", currentBalance.raw + reward);
      }
    } catch (error) {
      console.error("Error claiming monthly reward:", error);
      await interaction.reply({
        content: `${client.config.emojis.no} An error occurred while claiming your monthly reward.  \n${error.message}`,
        ephemeral: true,
      });
    }
  },
};
