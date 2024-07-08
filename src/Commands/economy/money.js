const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const eco = require("../../Util/EconomyManager.js");
const { emojis } = require("../../config");

const transactionTypes = [
  { name: "Wallet", value: "wallet" },
  { name: "Bank", value: "bank" },
];

const actionChoices = [
  { name: "Add", value: "add" },
  { name: "Reduce", value: "reduce" },
  { name: "Set", value: "set" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("money")
    .setDescription("Modify Someone's Balance")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Action (add, reduce, or set)")
        .addChoices(actionChoices)
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of Money")
        .setRequired(true)
        .setMinValue(0),
    )
    .addStringOption((option) =>
      option
        .setName("transaction_type")
        .setDescription("Type of Transaction")
        .addChoices(transactionTypes)
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The User You Want to Modify Balance"),
    )
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The User ID You Want to Modify Balance"),
    ),
  async run({ client, interaction }) {
    const userId =
      interaction.options.getUser("user")?.id ??
      interaction.options.getString("user_id");
    if (!userId) {
      return await interaction.reply({
        content: "Please provide either a user or a user ID.",
        ephemeral: true,
      });
    }

    const action = interaction.options.getString("action").toLowerCase();
    const amount = interaction.options.getNumber("amount");
    const balanceType = interaction.options.getString("transaction_type");

    await interaction.deferReply();
    try {
      const currentBalance = await eco.GetMoney({
        userID: userId,
        balance: balanceType,
      });

      let newBalance;
      if (action === "reduce") {
        newBalance = currentBalance.raw - amount;
      } else if (action === "set") {
        newBalance = amount;
      } else if (action === "add") {
        newBalance = currentBalance.raw + amount;
      }

      await eco.SetMoney({
        userID: userId,
        balance: balanceType,
        amount: newBalance,
      });

      const updatedBalance = await eco.GetMoney({
        userID: userId,
        balance: balanceType,
      });

      const user = await client.users.fetch(userId);
      const title = `${action.charAt(0).toUpperCase() + action.slice(1)} ${eco.formatMoney(amount)} to ${balanceType.charAt(0).toUpperCase() + balanceType.slice(1)}`;

      const balanceEmbed = new EmbedBuilder()
        .setTitle(title)
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .addFields({
          name: `New ${balanceType.charAt(0).toUpperCase() + balanceType.slice(1)} Balance`,
          value: eco.formatMoney(updatedBalance.raw),
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [balanceEmbed] });
    } catch (error) {
      console.error("Error modifying money:", error);
      await interaction.editReply(
        `${emojis.no} An error occurred while modifying money. \n${error.message}`,
      );
    }
  },
  options: { devOnly: true },
};
