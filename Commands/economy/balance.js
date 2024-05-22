const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const EconomyManager = require("../../Util/EconomyManager");

const eco = require("../../Util/EconomyManager.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check Someone's Balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the User You Want to Check Balance Of")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The User's ID You Want to Check Balance Of")
        .setRequired(false),
    ),
  run: async ({ client, interaction }) => {
    try {
      await interaction.deferReply();

      let userId =
        interaction.options.getUser("user")?.id ||
        interaction.options.getString("user_id") ||
        interaction.user.id;

      const user = await client.users.fetch(userId);
      if (!user)
        return await interaction.editReply(":x: Could not find that user.");

      const walletInfo = await eco.GetMoney({
        userID: userId,
        balance: "wallet",
      });
      const bankInfo = await eco.GetMoney({ userID: userId, balance: "bank" });

      const balanceEmbed = new EmbedBuilder()
        .setTitle("Balance")
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "Wallet",
            value: walletInfo.formatted,
          },
          {
            name: "Bank",
            value: bankInfo.formatted,
          },
        )
        .setColor("Random")
        .setTimestamp();

      await interaction.editReply({ embeds: [balanceEmbed] });
    } catch (error) {
      console.error("Error fetching balance:", error);
      await interaction.editReply("An error occurred while fetching balance.");
    }
  },
  options: { cooldown: "10s" },
};
