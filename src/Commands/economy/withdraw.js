const { SlashCommandBuilder } = require("discord.js");
const economyManager = require("../../Util/EconomyManager.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw money from your bank")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of money to withdraw")
        .setRequired(true),
    ),

  async run({ client, interaction }) {
    const userId = interaction.user.id;
    const amount = interaction.options.getNumber("amount");
    const bankBalance = await economyManager.GetMoney({
      userID: userId,
      balance: "bank",
    });
    const walletBalance = await economyManager.GetMoney({
      userID: userId,
      balance: "wallet",
    });

    if (amount > bankBalance.raw) {
      return interaction.reply({
        content: `${client.config.emojis.no} You do not have enough money in your bank.`,
        ephemeral: true,
      });
    }

    // Logic to transfer money from bank to wallet would go here
    // This is a placeholder for the actual implementation
    await economyManager.SetMoney({
      userID: userId,
      balance: "bank",
      amount: bankBalance.raw - amount,
    });
    await economyManager.SetMoney({
      userID: userId,
      balance: "wallet",
      amount: walletBalance.raw + amount,
    });

    await interaction.reply({
      content: `${client.config.emojis.yes} Withdrew ${economyManager.formatMoney(amount)} from your bank.`,
    });
  },
};
