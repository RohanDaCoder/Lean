const { ChannelType, PermissionsBitField } = require("discord.js");
const color = require("colors");
const Database = require("./Database");
const path = require("path");
const fs = require("fs");

async function setupServerStats({ interaction }) {
  try {
    const botId = interaction.client.user.id;
    const guildId = interaction.guild.id;
    const guildConfigDBPath = path.join(
      __dirname,
      `../Database/Guilds/${guildId}.json`,
    );
    const guildConfigDB = new Database(guildConfigDBPath);

    // Fetch the configuration from the database
    let guildConfig = {
      serverStatsCategory: await guildConfigDB.get("serverStatsCategory"),
      totalMembersChannel: await guildConfigDB.get("totalMembersChannel"),
      totalHumanMembersChannel: await guildConfigDB.get(
        "totalHumanMembersChannel",
      ),
      totalBotsChannel: await guildConfigDB.get("totalBotsChannel"),
    };

    // Check if all necessary configuration values are present and valid
    const allChannelsExist =
      guildConfig.serverStatsCategory &&
      guildConfig.totalMembersChannel &&
      guildConfig.totalHumanMembersChannel &&
      guildConfig.totalBotsChannel;

    if (allChannelsExist) {
      // Verify that the channels actually exist in the guild
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
        categoryExists &&
        totalMembersChannelExists &&
        totalHumanMembersChannelExists &&
        totalBotsChannelExists
      ) {
        // If all channels exist, notify the user and return
        return await interaction.followUp({
          content: "Server stats are already set up.",
          ephemeral: true,
        });
      }
    }

    const categoryName =
      interaction.options.getString("category-name") || "📊Server Stats📊";
    const totalMembersChannelName =
      interaction.options.getString("total-members-channel-name") ||
      "Total Members";
    const totalHumanMembersChannelName =
      interaction.options.getString("total-human-members-channel-name") ||
      "Total Human Members";
    const totalBotsChannelName =
      interaction.options.getString("total-bots-channel-name") || "Total Bots";

    const botMember = await interaction.guild.members.fetch(botId);

    if (
      !botMember.permissions.has([
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.ManageRoles,
      ])
    ) {
      return await interaction.followUp({
        content:
          "I do not have the necessary permissions to manage channels and roles.",
        ephemeral: true,
      });
    }

    const category = await interaction.guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
      position: 0,
    });

    const totalMembersChannel = await createOrUpdateChannel(
      interaction,
      totalMembersChannelName,
      0,
      guildConfig.totalMembersChannel,
      category,
    );
    const totalHumanMembersChannel = await createOrUpdateChannel(
      interaction,
      totalHumanMembersChannelName,
      0,
      guildConfig.totalHumanMembersChannel,
      category,
    );
    const totalBotsChannel = await createOrUpdateChannel(
      interaction,
      totalBotsChannelName,
      0,
      guildConfig.totalBotsChannel,
      category,
    );

    guildConfig = {
      serverStatsCategory: category.id,
      totalMembersChannel: totalMembersChannel.id,
      totalHumanMembersChannel: totalHumanMembersChannel.id,
      totalBotsChannel: totalBotsChannel.id,
    };

    await guildConfigDB.set("serverStatsCategory", category.id);
    await guildConfigDB.set("totalMembersChannel", totalMembersChannel.id);
    await guildConfigDB.set(
      "totalHumanMembersChannel",
      totalHumanMembersChannel.id,
    );
    await guildConfigDB.set("totalBotsChannel", totalBotsChannel.id);

    await updateServerStats(interaction.guild, guildConfig);

    await interaction.followUp({
      content: "Server stats setup complete.",
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error setting up server stats:", error);
    try {
      await interaction.followUp({
        content:
          "An error occurred while setting up server stats. \n" + error.message,
        ephemeral: true,
      });
    } catch (followUpError) {
      console.error("Error sending follow-up message:", followUpError);
    }
  }
}

async function updateServerStats(guild, guildConfig) {
  try {
    const fetchedGuild = await guild.fetch();
    const logger = await process.client.loggers.get(guild.id);
    const totalMembersCount = fetchedGuild.memberCount;
    const totalHumanMembersCount = await guild.members
      .fetch()
      .then((members) => members.filter((member) => !member.user.bot).size);
    const totalBotsCount = await guild.members
      .fetch()
      .then((members) => members.filter((member) => member.user.bot).size);

    await updateChannelName(
      guild,
      guildConfig.totalMembersChannel,
      `Total Members: ${totalMembersCount}`,
    );
    await updateChannelName(
      guild,
      guildConfig.totalHumanMembersChannel,
      `Total Human Members: ${totalHumanMembersCount}`,
    );
    await updateChannelName(
      guild,
      guildConfig.totalBotsChannel,
      `Total Bots: ${totalBotsCount}`,
    );
  } catch (error) {
    if (error.code === 50001) {
      if (logger) {
        await logger.warn({
          message: `I Don't Have Enough Permissions To Update Server Stats.`,
          user: `Server Stats Auto Updater`,
        });
      }
    }
    console.error("Error updating server stats:", error);
  }
}

async function createOrUpdateChannel(
  interaction,
  name,
  count,
  existingChannelId,
  parent,
) {
  const channelName = `${name}: ${count}`;
  try {
    if (existingChannelId) {
      const channel = await interaction.guild.channels.fetch(existingChannelId);
      if (channel) {
        await channel.edit({ name: channelName });
        return channel;
      }
    }
    const newChannel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildVoice,
      parent: parent.id,
    });
    return newChannel;
  } catch (error) {
    console.error("Error creating or updating channel:", error);
  }
}

async function updateChannelName(guild, channelId, name) {
  try {
    const channel = await guild.channels.fetch(channelId);
    if (channel) {
      await channel.edit({ name });
    }
  } catch (error) {
    if (error.code === 50001) return;
    console.error("Error updating channel name: " + error);
  }
}

async function channelExists(guild, channelId) {
  try {
    const channel = await guild.channels.fetch(channelId);
    return !!channel;
  } catch (error) {
    return false;
  }
}

async function updateAllGuildStats(interaction) {
  try {
    const guildsDir = path.join(__dirname, "../Database/Guilds/");
    const files = await fs.promises.readdir(guildsDir); // Use fs.promises.readdir for async/await

    for (const file of files) {
      const guildConfigPath = path.join(guildsDir, file);
      const guildConfig = require(guildConfigPath);

      const guildId = path.basename(file, ".json");
      const guild = await process.client.guilds.fetch(guildId);
      const logger = await process.client.loggers.get(guildId);

      if (!guild) {
        console.log(colors.red(`Guild not found: ${guildId}`));
        if (interaction) {
          await interaction.followUp({
            content: `Guild not found: ${guildId}`,
            ephemeral: true,
          });
        }
        continue; // Skip to the next guild if guild is not found
      }

      if (
        !guild.members.me.permissions.has(
          PermissionsBitField.Flags.ManageChannels,
        )
      ) {
        if (logger) {
          await logger.warn({
            message: `I don't have enough permissions to update server stats`,
            user: `Server Stats Auto Updater`,
          });
        }
        if (interaction) {
          await interaction.followUp({
            content: `I don't have enough permissions to update the channels of ${guild.name}`,
            ephemeral: true,
          });
        }
        continue; // Skip to the next guild if bot doesn't have manage channels permission
      }

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
        }
      }
    }
  } catch (error) {
    console.error("Error updating server stats for all guilds: ", error);
    if (interaction) {
      await interaction.followUp({
        content: `Error updating server stats for all guilds: ${error.message}`,
        ephemeral: true,
      });
    }
    if (error.code === 10004) {
      if (interaction) {
        await interaction.followUp({
          content: `One or more guilds are unknown.`,
          ephemeral: true,
        });
      }
    }
  }
}

module.exports = {
  setupServerStats,
  updateServerStats,
  channelExists,
  updateAllGuildStats,
};
