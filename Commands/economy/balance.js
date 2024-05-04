const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require('simple-json-db');
const { emojis } = require("../../config")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check Someone's Balance")
    .addMentionableOption(option =>
      option.setName("user")
      .setDescription("Mention The User You Want To Check Balance Of")
      .setRequired(false))
    .addStringOption(option =>
      option.setName("user_id")
      .setDescription("The User's ID You Want To Check Balance Of")
      .setRequired(false)),
  run: async ({ client, interaction }) => {
    await interaction.deferReply();
    //Getting The ID
    let id;
    const mention = interaction.options.getMentionable("user");
    const userId = interaction.options.getString("user_id");
    if (!mention && !userId) id = interaction.user.id;
    if (mention) id = mention.user.id;
    if (!mention && userId) id = userId;
    const user = await client.users.fetch(id);


    //Getting Balance.
    const profile = new db(`../../Database/${id}.json`);
    const wallet = `${profile.get("wallet").toLocaleString()}${emojis.money}`;
    const bank = `${profile.get("bank").toLocaleString()}${emojis.money}`;

    //Creating Embed And Send
    const balanceEmbed = new EmbedBuilder()
      .setName(`${user.username}'s Balance`)
      .addFields({
        name: "Wallet",
        value: wallet
      }, {
        name: "Bank",
        value: bank,
      })
      .setColor("RANDOM")
      .addTimestamp();

    await interaction.editReply({ embeds: [balanceEmbed] });
  }
};