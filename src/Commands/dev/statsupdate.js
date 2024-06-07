const {
  updateServerStats,
  channelExists,
} = require("../../Util/ServerStatsUtils.js"); // Correct the path if necessary
const Database = require("../../Util/Database");
const path = require("path");

module.exports = {
  data: {
    name: "statsupdate",
    description: "Developer-only command to update server stats counters.",
  },
  run: async ({ interaction, client, handler }) => {
    try {
      await interaction.deferReply();
      const guildId = interaction.guild.id;
      const guildConfigDBPath = path.join(
        __dirname,
        `../../Database/Guilds/${guildId}.json`,
      );
      const guildConfigDB = new Database(guildConfigDBPath);

      const guildConfig = {
        serverStatsCategory: await guildConfigDB.get("serverStatsCategory"),
        totalMembersChannel: await guildConfigDB.get("totalMembersChannel"),
        totalHumanMembersChannel: await guildConfigDB.get(
          "totalHumanMembersChannel",
        ),
        totalBotsChannel: await guildConfigDB.get("totalBotsChannel"),
      };

      const allChannelsExist =
        guildConfig.serverStatsCategory &&
        guildConfig.totalMembersChannel &&
        guildConfig.totalHumanMembersChannel &&
        guildConfig.totalBotsChannel;

      if (!allChannelsExist) {
        await interaction.followUp({
          content: "Server stats are not properly configured.",
          ephemeral: false,
        });
        return;
      }

      const categoryExists = await channelExists(
        interaction.guild,
        guildConfig.serverStatsCategory,
      );
      const totalMembersChannelExists = await channelExists(
        interaction.guild,
        guildConfig.totalMembersChannel,
      );
      const totalHumanMembersChannelExists = await channelExists(
        interaction.guild,
        guildConfig.totalHumanMembersChannel,
      );
      const totalBotsChannelExists = await channelExists(
        interaction.guild,
        guildConfig.totalBotsChannel,
      );

      if (
        !categoryExists ||
        !totalMembersChannelExists ||
        !totalHumanMembersChannelExists ||
        !totalBotsChannelExists
      ) {
        await interaction.followUp({
          content: "One or more required channels do not exist.",
          ephemeral: false,
        });
        return;
      }

      await updateServerStats(interaction.guild, guildConfig);
      await interaction.followUp({
        content: "Server stats updated successfully.",
        ephemeral: false,
      });
    } catch (error) {
      console.error("Error updating server stats:", error);
      await interaction.followUp({
        content: `An error occurred while updating server stats: ${error.message}`,
        ephemeral: false,
      });
    }
  },
  options: { devOnly: false },
};
