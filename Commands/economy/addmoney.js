const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("simple-json-db");
const { emojis } = require("../../config");
const path = require("path");
const EconomyManager = require("../../Util/EconomyManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modifymoney")
    .setDescription("Modify Someone's Balance")
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
    )
    .addNumberOption((option) =>
      option
        .setName("add")
        .setDescription("Amount of Money to Add")
        .setRequired(false),
    )
    .addNumberOption((option) =>
      option
        .setName("set")
        .setDescription("Amount of Money to Set")
        .setRequired(false),
    )
    .addNumberOption((option) =>
      option
        .setName("reduce")
        .setDescription("Amount of Money to Reduce")
        .setRequired(false),
    ),
  async run({ client, interaction }) {
    const userId = interaction.options.getString("user_id");
    const setAmount = interaction.options.getNumber("set");
    const addAmount = interaction.options.getNumber("add") || 0;
    const reduceAmount = interaction.options.getNumber("reduce") || 0;
    const transactionType = interaction.options.getString("transaction_type");
    if (!setAmount && setAmount === 0 && reduceAmount === 0)
      return await interaction.reply({
        content: `No Action Provided`,
      });
    await interaction.deferReply();
    try {
      const economyManager = new EconomyManager();
      await economyManager.ModifyMoney({
        userID: userId,
        set: setAmount,
        add: addAmount,
        reduce: reduceAmount,
        type: transactionType,
      });
      const updatedBalance = await economyManager.fetchMoney({
        userID: userId,
        type: transactionType,
      });

      const formattedBalance = `${updatedBalance.toLocaleString()} ${emojis.money}`;
      const user = await client.users.cache.find((i) => i.id === userId);
      const balanceEmbed = new EmbedBuilder()
        .setTitle(`New Balance`)
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({
            dynamic: true,
          }),
        })
        .addFields({
          name: transactionType,
          value: updatedBalance,
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [balanceEmbed] });
    } catch (error) {
      console.error("Error adding money:", error);
      await interaction.editReply(
        "An error occurred while adding money. \n" + error.message,
      );
    }
  },
  options: {
    devOnly: true,
  },
};
