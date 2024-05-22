const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const EconomyManager = require("../../Util/EconomyManager.js");
const economyManager = require("../../Util/EconomyManager.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Play slots to gamble your money")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("The amount of money to bet")
        .setRequired(true),
    ),

  async run({ client, interaction }) {
    const userId = interaction.user.id;
    const bet = interaction.options.getNumber("bet");
    const walletBalance = await economyManager.GetMoney({
      userID: userId,
      balance: "wallet",
    });

    if (bet > walletBalance.raw) {
      return interaction.reply({
        content: "You cannot afford this bet.",
        ephemeral: true,
      });
    }

    const slots = ["🍒", "💎", "7️⃣"];
    const result = Array.from(
      { length: 3 },
      () => slots[Math.floor(Math.random() * slots.length)],
    );

    let winnings = 0;
    if (result[0] === result[1] && result[1] === result[2]) {
      winnings = bet * 5; // Example payout for matching all slots
    } else if (result.includes(result[0])) {
      winnings = bet * 2; // Example payout for partial match
    }

    await economyManager.SetMoney({
      userID: userId,
      balance: "wallet",
      amount: walletBalance.raw - bet + winnings,
    });

    const slotsEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Slots Result")
      .setDescription(result.join(" "))
      .addField("Winnings", economyManager.formatMoney(winnings));

    await interaction.reply({ embeds: [slotsEmbed] });
  },
};
