const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require('simple-json-db');
const { emojis } = require("../../config");
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmoney")
    .setDescription("Add Money to Someone's Account")
    .addIntegerOption(option =>
      option.setName("amount")
      .setDescription("Amount of Money to Add")
      .setRequired(true))
    .addStringOption(option =>
      option.setName("user_id")
      .setDescription("The User's ID You Want To Add Money To")
      .setRequired(true))
    .addStringOption(option =>
      option.setName("type")
      .setDescription("Type of Money to Add (wallet or bank)")
      .setRequired(true)
      .addChoice("Wallet", "wallet")
      .addChoice("Bank", "bank"))
    .addMentionableOption(option =>
      option.setName("user")
      .setDescription("Mention The User You Want To Add Money To")
      .setRequired(false)),
  run: async ({ client, interaction }) => {
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
    const type = interaction.options.getString("type");
    if (type === "wallet") {
      profile.set("wallet", walletRaw + amount);
    } else if (type === "bank") {
      profile.set("bank", bankRaw + amount);
    }

    // Updated Balance
    const wallet = `${walletRaw.toLocaleString()} ${emojis.money}`;
    const bank = `${bankRaw.toLocaleString()} ${emojis.money}`;

    // Creating Embed And Send
    const actionType = type === "wallet" ? "added to wallet" : "added to bank";
    const balanceEmbed = new EmbedBuilder()
      .setTitle(`Money Added to ${name}'s Account`)
      .addFields({
        name: "New Wallet Balance",
        value: wallet
      }, {
        name: "New Bank Balance",
        value: bank
      })
      .setColor("Random")
      .setTimestamp();

    await interaction.editReply({ embeds: [balanceEmbed] });
  },
  options: {
    devsOnly: true
  }
};