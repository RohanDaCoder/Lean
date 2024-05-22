const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const EconomyManager = require("../../Util/EconomyManager.js");
const economyManager = require("../../Util/EconomyManager.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the leaderboard"),

  async run({ interaction, client }) {
    const dirPath = path.join(__dirname, "../../Database/Profiles");
    let leaderboard = [];

    fs.readdirSync(dirPath).forEach((file) => {
      const filePath = path.join(dirPath, file);
      const rawData = fs.readFileSync(filePath);
      const userData = JSON.parse(rawData);
      const totalBalance = userData.wallet + userData.bank;

      leaderboard.push({
        id: userData.id,
        balance: totalBalance,
      });
    });

    leaderboard = leaderboard
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    const leaderboardEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Leaderboard")
      .setDescription("Top 10 richest users");

    for (const [index, user] of leaderboard.entries()) {
      const member = await client.users.fetch(user.id).catch(() => null);
      leaderboardEmbed.addFields({
        name: `${index + 1}. ${member?.username || "Unknown User"}`,
        value: economyManager.formatMoney(user.balance),
        inline: true,
      });
    }

    await interaction.reply({
      embeds: [leaderboardEmbed],
    });
  },
};
