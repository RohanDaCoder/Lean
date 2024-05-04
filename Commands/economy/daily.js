  const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
  const db = require('simple-json-db');
  const { emojis } = require("../../config");
  const path = require('path');

  // Function to add coins to user's wallet
  const addCoins = (userId, amount) => {
    const dbPath = path.join(__dirname, `../../Database/${userId}.json`);
    const profile = new db(dbPath);
    const walletRaw = profile.get("wallet") || 0;
    profile.set("wallet", walletRaw + amount);
  };

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("daily")
      .setDescription("Claim Your Daily Coins"),
    run: async ({ client, interaction }) => {
      await interaction.deferReply();

      const userId = interaction.user.id;
      const dbPath = path.join(__dirname, `../../Database/${userId}.json`);
      const profile = new db(dbPath);

      // Check if user has claimed daily within the last 12 hours
      const lastClaimed = new Date(profile.get("last_claimed")) || null;
      const currentTime = new Date();
      const timeSinceLastClaimed = currentTime - lastClaimed;
      const twelveHoursInMillis = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

      if (lastClaimed && timeSinceLastClaimed < twelveHoursInMillis) {
        const remainingTimeInMillis = twelveHoursInMillis - timeSinceLastClaimed;
        const remainingTimeInHours = Math.ceil(remainingTimeInMillis / (60 * 60 * 1000));
        await interaction.editReply(`You have already claimed your daily coins. Please wait ${remainingTimeInHours} hours before claiming again.`);
        return;
      }

      // Add coins to user's wallet
      addCoins(userId, 500);

      // Update last claimed time
      profile.set("last_claimed", currentTime.toISOString());

      // Send confirmation message
      await interaction.editReply("You have successfully claimed your daily coins! 500 coins have been added to your wallet.");
    }
  };