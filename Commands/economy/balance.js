const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require('simple-json-db');
const { emojis } = require("../../config");
const path = require('path');

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
    // Getting The ID
    let id;
    const mention = interaction.options.getMentionable("user");
    const userId = interaction.options.getString("user_id");
    if (!mention && !userId) id = interaction.user.id;
    if (mention) id = mention.id;
    if (!mention && userId) id = userId;

    // Getting Balance
    const dbPath = path.join(__dirname, `../../Database/${id}.json`);
    const profile = new db(dbPath);
    const walletRaw = profile.get("wallet") || 0;
    const bankRaw = profile.get("bank") || 0;
    const wallet = `${walletRaw.toLocaleString()}${emojis.money}`;
    const bank = `${bankRaw.toLocaleString()}${emojis.money}`;

    // Creating Embed And Send
    const balanceEmbed = new EmbedBuilder()
      .setTitle(`${interaction.user.username}'s Balance`)
      .addFields({ name: "Wallet", value: wallet }, { name: "Bank", value: bank })
      .setColor("Random")
      .setTimestamp();

    await interaction.editReply({ embeds: [balanceEmbed] });
  }
};