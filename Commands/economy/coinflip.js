const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const EconomyManager = require("../../Util/EconomyManager");
const economyManager = new EconomyManager();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Bet on a coin flip")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Choose heads or tails")
        .setChoices([
          { name: "Heads", value: "heads" },
          { name: "Tails", value: "tails" },
        ])
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("The amount of money to bet")
        .setRequired(true),
    ),

  async run({ client, interaction }) {
    const userId = interaction.user.id;
    const choice = interaction.options.getString("choice");
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

    const flip = Math.random() < 0.5 ? "heads" : "tails";
    let winnings = 0;
    if (choice === flip) {
      winnings = bet * 2; // Double the bet if the user wins
    }

    await economyManager.SetMoney({
      userID: userId,
      balance: "wallet",
      amount: walletBalance.raw - bet + winnings,
    });

    const coinFlipEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Coin Flip Result")
      .setDescription(flip === "heads" ? "Heads 🤞" : "Tails 👌")
      .addFields([
        {
          name: "Outcome",
          value: choice === flip ? "You won!" : "You lost.",
          inline: true,
        },
        {
          name: "Winnings",
          value: economyManager.formatMoney(winnings),
          inline: true,
        },
      ]);

    await interaction.reply({ embeds: [coinFlipEmbed] });
  },
};
