const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const EconomyManager = require("../../Util/EconomyManager.js");
const economyManager = new EconomyManager();
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

    if (amount > bankBalance.raw) {
      return interaction.reply({
        content: "You do not have enough money in your bank.",
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
      amount: amount,
    });

    await interaction.reply({
      content: `Withdrew ${economyManager.formatMoney(amount)} from your bank.`,
    });
  },
};
