const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const GetBalance = require("../../Util/Economy/GetBalance.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check Someone's Balance")
    .addMentionableOption((option) => option
      .setName("user_id")
      .setDescription("The User's ID You Want To Check Balance Of")
      .setRequired(false)),
  run: async ({ interaction, client }) => {

    const target = interaction.options.getString("user_id")?.value;
    let targetUser;
    if (target) {
      targetUser = client.users.fetch(target)
    } else {
      targetUser = interaction.user;
    };

    const { walletFormated, bankFormated } = await GetBalance(targetUser.id);


    const balanceEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${targetUser.username}'s Balance`)
      .addFields({ name: 'Wallet', value: walletFormated, inline: true }, { name: 'Bank', value: bankFormated, inline: true }, )
      .setTimestamp();
    await interaction.reply({ embeds: [balanceEmbed] })
  }
};