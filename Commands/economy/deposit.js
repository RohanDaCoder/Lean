const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const EconomyManager = require("../../Util/EconomyManager.js");
const economyManager = new EconomyManager();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposit money into your bank")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of money to deposit")
        .setRequired(true),
    ),

  async run({ client, interaction }) {
    const userId = interaction.user.id;
    const amount = interaction.options.getNumber("amount");
    const walletBalance = await economyManager.GetMoney({
      userID: userId,
      balance: "wallet",
    });

    if (amount > walletBalance.raw) {
      return interaction.reply({
        content: "You do not have enough money in your wallet.",
        ephemeral: true,
      });
    }

    // Logic to transfer money from wallet to bank would go here
    // This is a placeholder for the actual implementation
    await economyManager.SetMoney({
      userID: userId,
      balance: "wallet",
      amount: walletBalance.raw - amount,
    });
    await economyManager.SetMoney({
      userID: userId,
      balance: "bank",
      amount: amount,
    });

    await interaction.reply({
      content: `Deposited ${economyManager.formatMoney(amount)} into your bank.`,
    });
  },
};
