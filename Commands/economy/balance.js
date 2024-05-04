const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {GetBalance} = require("../../Util/Economy.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check Someone's Balance")
    .addMentionableOption(option =>
      option.setName("user_id")
      .setDescription("The User's ID You Want To Check Balance Of")
      .setRequired(false)),
  run: async ({ client, interaction }) => {

    const target = interaction.options.getString("user_id");
    let targetUser;
    if (target) {
      try {
        targetUser = await client.users.fetch(target);
      } catch (error) {
        console.error("Error fetching user:", error);
        return interaction.reply("Failed to fetch user.");
      }
    } else {
      targetUser = interaction.user;
    }

    try {
      const { walletFormatted, bankFormatted } = await GetBalance(targetUser.id);

      const balanceEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${username}'s Balance`)
        .addFields({ name: 'Wallet', value: walletFormatted, inline: true }, { name: 'Bank', value: bankFormatted, inline: true }, )
        .setTimestamp();

      await interaction.reply({ embeds: [balanceEmbed] });
    } catch (error) {
      console.error("Error getting balance:", error);
      await interaction.followUp("Failed to retrieve balance. \nError: " + error.message);
    }
  }
};