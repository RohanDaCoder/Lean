const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("simple-json-db");
const { emojis } = require("../../config");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmoney")
    .setDescription("Add Money to Someone's Account")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of Money to Add")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The User's ID You Want To Add Money To")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("transaction_type")
        .setDescription("Type of Transaction (wallet or bank)")
        .setRequired(true),
    ),
  async run({ client, interaction }) {
    await interaction.deferReply();
    // Getting The ID
    let id;
    const userId = interaction.options.getString("user_id");
    const mention = interaction.options.getMentionable("user");
    if (!mention && userId) id = userId;
    if (mention) id = mention.id;

    // Getting Balance
    const dbPath = path.join(__dirname, `../../Database/${id}.json`);
    const profile = new db(dbPath);
    const walletRaw = profile.get("wallet") || 0;
    const bankRaw = profile.get("bank") || 0;
    const name = profile.get("username");

    // Adding Money
    const amount = interaction.options.getInteger("amount");
    const transactionType = interaction.options.getString("transaction_type");
    let updatedBalance;
    if (transactionType === "wallet") {
      profile.set("wallet", walletRaw + amount);
      updatedBalance = walletRaw + amount;
    } else if (transactionType === "bank") {
      profile.set("bank", bankRaw + amount);
      updatedBalance = bankRaw + amount;
    }

    // Updated Balance
    const formattedBalance = `${updatedBalance.toLocaleString()} ${emojis.money}`;

    // Creating Embed And Send
    const actionType =
      transactionType === "wallet" ? "added to wallet" : "added to bank";
    const balanceEmbed = new EmbedBuilder()
      .setTitle(`Money ${actionType} for ${name}`)
      .addFields({
        name: `New ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} Balance`,
        value: formattedBalance,
      })
      .setColor("Random")
      .setTimestamp();

    await interaction.editReply({ embeds: [balanceEmbed] });
  },
  options: {
    devOnly: true,
  },
};
