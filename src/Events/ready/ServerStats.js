const fs = require("fs").promises;
const path = require("path");
const {
  updateServerStats,
  channelExists,
} = require("../../Util/ServerStatsUtils.js");
const colors = require("colors");

module.exports = async (client) => {
  // Function to update server stats for all guilds
  async function updateAllGuildStats() {
    try {
      const guildsDir = path.join(__dirname, "../Database/Guilds/");
      const files = await fs.readdir(guildsDir);

      for (const file of files) {
        const guildConfigPath = path.join(guildsDir, file);
        const guildConfig = require(guildConfigPath);

        const guildId = path.basename(file, ".json");
        const guild = await client.guilds.fetch(guildId);

        if (guild) {
          const allChannelsExist =
            guildConfig.serverStatsCategory &&
            guildConfig.totalMembersChannel &&
            guildConfig.totalHumanMembersChannel &&
            guildConfig.totalBotsChannel;

          if (allChannelsExist) {
            const categoryExists = await channelExists(
              guild,
              guildConfig.serverStatsCategory,
            );
            const totalMembersChannelExists = await channelExists(
              guild,
              guildConfig.totalMembersChannel,
            );
            const totalHumanMembersChannelExists = await channelExists(
              guild,
              guildConfig.totalHumanMembersChannel,
            );
            const totalBotsChannelExists = await channelExists(
              guild,
              guildConfig.totalBotsChannel,
            );

            if (
              categoryExists &&
              totalMembersChannelExists &&
              totalHumanMembersChannelExists &&
              totalBotsChannelExists
            ) {
              await updateServerStats(guild, guildConfig);
              console.log(`Updated server stats for guild: ${guild.name}`);
            } else {
              console.log(
                `One or more channels do not exist in guild: ${guild.name}`,
              );
            }
          }
        } else {
          console.log(`Guild not found: ${guildId}`);
        }
      }
    } catch (error) {
      console.error("Error updating server stats for all guilds:", error);
    }
  }

  // Set interval to update stats every 10 minutes
  setInterval(updateAllGuildStats, 10 * 60 * 1000);
};
