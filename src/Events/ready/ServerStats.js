const fs = require("fs")
   .promises;
const path = require("path");
const {
   updateServerStats,
   channelExists,
} = require("../../Util/ServerStatsUtils");
const colors = require("colors");
const {
   PermissionsBitField
} = require("discord.js");

module.exports = async() => {
   updateAllGuildStats();
   setInterval(updateAllGuildStats, 600000);
};

async function updateAllGuildStats(interaction) {
   try {
      const guildsDir = path.join(__dirname, "../../Database/Guilds/");
      const files = await fs.readdir(guildsDir);

      for (const file of files) {
         const guildConfigPath = path.join(guildsDir, file);
         const guildConfig = require(guildConfigPath);

         const guildId = path.basename(file, ".json");
         const guild = await process.client.guilds.fetch(guildId);
         if (!guild.members.me.permissions.has(
         PermissionsBitField.Flags.ManageChannels, )) {
            if (interaction) interaction.followUp({
               content: `I Don't Have Enough Permissions To Update The Channels Of ${guild.name}`,
               ephemeral: true,
            });
            console.log(`I Don't Have Enough Permission For ${guild.name}`);
         }

         if (guild) {
            const allChannelsExist = guildConfig.serverStatsCategory && guildConfig.totalMembersChannel && guildConfig.totalHumanMembersChannel && guildConfig.totalBotsChannel;

            if (allChannelsExist) {
               const categoryExists = await channelExists(
               guild,
               guildConfig.serverStatsCategory, );
               const totalMembersChannelExists = await channelExists(
               guild,
               guildConfig.totalMembersChannel, );
               const totalHumanMembersChannelExists = await channelExists(
               guild,
               guildConfig.totalHumanMembersChannel, );
               const totalBotsChannelExists = await channelExists(
               guild,
               guildConfig.totalBotsChannel, );

               if (
               categoryExists && totalMembersChannelExists && totalHumanMembersChannelExists && totalBotsChannelExists) {
                  await updateServerStats(guild, guildConfig);
               }
            }
         } else {
            console.log(colors.red(`Guild not found: ${guildId}`));
            if (interaction) await interaction.followUp({
               content: `Guild not found: ${guildId}`,
               ephemeral: true,
            });
         }
      }
   } catch (error) {
      if (error.code === 10004) {
         if (interaction) await interaction.followUp({
            content: `One Or More Guilds Are Unknown.`,
            ephemeral: true,
         });
      }
      return;
   }
   console.error("Error updating server stats for all guilds: " + error);
   if (interaction) await interaction.followUp({
      content: `Error updating server stats for all guilds: ${error.message}`,
      ephemeral: true,
   });
}

module.exports.updateAllGuildStats = updateAllGuildStats;