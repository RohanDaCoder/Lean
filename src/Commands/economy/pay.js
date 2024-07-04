const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
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
    try {
      await interaction.deferReply();
      const senderId = interaction.user.id;
      const amount = interaction.options.getNumber("amount");
      const receiverId =
        interaction.options.getUser("user_mention")?.id ??
        interaction.options.getString("user_id");
      interaction.options.getUser("user_mention")?.id ??
        interaction.options.getString("user_id");

      const eco = require("../../Util/EconomyManager.js");
      const senderWallet = await eco.GetMoney({
        userID: senderId,
        balance: "wallet",
      });

      if (senderWallet.raw < amount) {
        return await interaction.editReply(
          `${client.config.emojis.no} You don't have enough coins in your wallet. You need ${amount - senderWallet.raw} more coins to make this transfer.`,
        );
      }

      await eco.SetMoney({
        userID: senderId,
        balance: "wallet",
        amount: senderWallet.raw - amount,
      });

      // Add the transferred amount to the receiver's balance
      await eco.SetMoney({
        userID: receiverId,
        balance: "wallet",
        amount:
          (
            await eco.GetMoney({
              userID: receiverId,
              balance: "wallet",
            })
          ).raw + amount,
      });

      const senderTag = interaction.user.tag;
      const receiverUser = await client.users.fetch(receiverId);
      const receiverTag = receiverUser.tag;

      const embed = new EmbedBuilder()
        .setTitle(`Paying ${receiverTag}`)
        .setColor("Blurple")
        .addFields(
          { name: "Transfer From", value: senderTag },
          { name: "Transfer to", value: receiverTag },
          { name: "Money Amount", value: eco.formatMoney(amount) },
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error transferring coins:", error);
      await interaction.editReply(
        `${client.config.emojis.no} An error occurred while transferring coins: ${error.message}`,
      );
    }
  },
};
