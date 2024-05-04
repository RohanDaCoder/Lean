const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require('simple-json-db');
const { emojis } = require("../../config");
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check Someone's Balance")
    .addUserOption(option =>
      option.setName("user")
      .setDescription("Select the User You Want to Check Balance Of")
      .setRequired(false))
    .addStringOption(option =>
      option.setName("user_id")
      .setDescription("The User's ID You Want to Check Balance Of")
      .setRequired(false)),
  run: async ({ client, interaction }) => {
    await interaction.deferReply();
    // Getting The ID
    let id;
    const userOption = interaction.options.getUser("user");
    const userId = interaction.options.getString("user_id");
    if (!userOption && !userId) {
      id = interaction.user.id;
    } else if (userOption) {
      id = userOption.id;
    } else if (userId) {
      id = userId;
    }

    // Getting Balance
    const dbPath = path.join(__dirname, `../../Database/${id}.json`);
    const profile = new db(dbPath);

    if (!profile.has("username")) {
      await interaction.editReply(":x: This user doesn't exist or hasn't used our bot.");
      return;
    }

    const walletRaw = profile.get("wallet") || 0;
    const bankRaw = profile.get("bank") || 0;
    const wallet = `${walletRaw.toLocaleString()} ${emojis.money}`;
    const bank = `${bankRaw.toLocaleString()} ${emojis.money}`;
    const name = profile.get("username");

    // Creating Embed And Send
    const balanceEmbed = new EmbedBuilder()
      .setTitle(`${name}'s Balance`)
      .addFields({ name: "Wallet", value: wallet }, { name: "Bank", value: bank })
      .setColor("Random")
      .setTimestamp();

    await interaction.editReply({ embeds: [balanceEmbed] })
  }
};