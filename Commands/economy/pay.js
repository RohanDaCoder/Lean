const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const path = require("path");
const EconomyManager = require("../../Util/EconomyManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Transfer Coins to Another User's Account")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of Coins to Transfer")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The User's ID You Want To Transfer Coins To")
        .setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("user_mention")
        .setDescription("Mention the User You Want To Transfer Coins To")
        .setRequired(false),
    ),
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const senderId = interaction.user.id;
    let receiverId;
    const amount = interaction.options.getNumber("amount");
    const userMention = interaction.options.getUser("user_mention");
    const userId = interaction.options.getString("user_id");

    if (userMention) {
      receiverId = userMention.id;
    } else {
      receiverId = userId;
    }

    try {
      const economyManager = new EconomyManager();

      const senderWallet = await economyManager.fetchMoney({
        userID: senderId,
        type: "wallet",
      });
      if (senderWallet < amount) {
        const neededAmount = amount - senderWallet;
        await interaction.editReply(
          `You don't have enough coins in your wallet. You need ${neededAmount} more coins to make this transfer.`,
        );
        return;
      }

      const receiverUser = await client.users.fetch(receiverId);
      const receiverTag = receiverUser.tag;

      const senderResult = await economyManager.ModifyMoney({
        userID: senderId,
        reduce: amount,
        type: "wallet",
      });
      if (!senderResult)
        throw new Error("Failed to deduct coins from sender's wallet.");

      const receiverResult = await economyManager.ModifyMoney({
        userID: receiverId,
        add: amount,
        type: "wallet",
      });
      if (!receiverResult)
        throw new Error("Failed to add coins to receiver's wallet.");

      const senderTag = interaction.user.tag;

      const embed = new EmbedBuilder()
        .setTitle(`Paying ${receiverTag}`)
        .setColor("Random")
        .addFields(
          { name: "Transfer From", value: senderTag },
          { name: "Transfer to", value: receiverTag },
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error transferring coins:", error);
      await interaction.editReply(
        `An error occurred while transferring coins: ${error.message}`,
      );
    }
  },
};
