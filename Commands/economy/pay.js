const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("simple-json-db");
const { emojis } = require("../../config");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Transfer Coins to Another User's Account")
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The User's ID You Want To Transfer Coins To")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of Coins to Transfer")
        .setRequired(true),
    ),
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const senderId = interaction.user.id;
    const receiverId = interaction.options.getString("user_id");
    const amount = interaction.options.getInteger("amount");

    const senderDbPath = path.join(
      __dirname,
      `../../Database/${senderId}.json`,
    );
    const senderProfile = new db(senderDbPath);
    const senderWallet = senderProfile.get("wallet") || 0;
    if (senderWallet < amount) {
      await interaction.editReply(
        "You don't have enough coins in your wallet to make this transfer.",
      );
      return;
    }

    const receiverDbPath = path.join(
      __dirname,
      `../../Database/${receiverId}.json`,
    );
    const receiverProfile = new db(receiverDbPath);
    const receiverUsername = receiverProfile.get("username") || "Unknown User";
    const receiverWallet = receiverProfile.get("wallet") || 0;

    senderProfile.set("wallet", senderWallet - amount);
    receiverProfile.set("wallet", receiverWallet + amount);

    await interaction.editReply(
      `You have successfully transferred ${amount} coins to ${receiverUsername}.`,
    );
  },
};
