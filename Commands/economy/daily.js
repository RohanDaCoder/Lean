const { SlashCommandBuilder } = require("discord.js");
const EconomyManager = require("../../Util/EconomyManager");

const eco = new EconomyManager();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim Your Daily Coins"),
  run: async ({ client, interaction }) => {
    try {
      const profile = await eco.GetProfile({ userID: interaction.user.id });
      const check = profile.get("dailyCheck");
      const timeout = 86400000; // 24 hours
      const timeLeft = Date.now() - check;

      if (check !== null && timeLeft < timeout) {
        const remainingTime = timeout - timeLeft;
        const prettyRemainingTime = require("pretty-ms")(remainingTime, {
          verbose: true,
        });

        await interaction.reply({
          content: `You have already claimed your daily prize. Please wait ${prettyRemainingTime} before claiming again.`,
          ephemeral: true,
        });
        return;
      } else {
        const reward = 500;
        const currentBalance = await eco.GetMoney({
          userID: interaction.user.id,
          balance: "wallet",
        });
        await interaction.reply({
          content: `GG! You claimed ${reward} as your daily reward.`,
        });
        await eco.SetMoney({
          userID: interaction.user.id,
          balance: "wallet",
          amount: currentBalance + reward,
        });
        profile.set("dailyCheck", Date.now());
      }
    } catch (error) {
      console.error("Error claiming daily reward:", error);
      await interaction.reply({
        content: "An error occurred while claiming your daily reward.",
        ephemeral: true,
      });
    }
  },
};
