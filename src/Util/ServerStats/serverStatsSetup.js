const { ChannelType, PermissionsBitField } = require("discord.js");
const {
  createOrUpdateChannel,
  updateChannelName,
  channelExists,
} = require("./channelUtils");
const GuildConfig = require("../../Models/GuildConfig");

async function setupServerStats({ interaction }) {
  try {
    const botId = interaction.client.user.id;
    const guildId = interaction.guild.id;

    const guildConfig = await GuildConfig.findOneAndUpdate(
      { guildId },
      { guildId },
      { upsert: true, new: true },
    );

    let guildConfigData = {
      serverStatsCategory: guildConfig.serverStatsCategory,
      totalMembersChannel: guildConfig.totalMembersChannel,
      totalHumanMembersChannel: guildConfig.totalHumanMembersChannel,
      totalBotsChannel: guildConfig.totalBotsChannel,
    };

    const allChannelsExist =
      guildConfigData.serverStatsCategory &&
      guildConfigData.totalMembersChannel &&
      guildConfigData.totalHumanMembersChannel &&
      guildConfigData.totalBotsChannel;

    if (allChannelsExist) {
      const categoryExists = await channelExists(
        interaction.guild,
        guildConfigData.serverStatsCategory,
      );
      const totalMembersChannelExists = await channelExists(
        interaction.guild,
        guildConfigData.totalMembersChannel,
      );
      const totalHumanMembersChannelExists = await channelExists(
        interaction.guild,
        guildConfigData.totalHumanMembersChannel,
      );
      const totalBotsChannelExists = await channelExists(
        interaction.guild,
        guildConfigData.totalBotsChannel,
      );

      if (
        categoryExists &&
        totalMembersChannelExists &&
        totalHumanMembersChannelExists &&
        totalBotsChannelExists
      ) {
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
      guildConfigData.totalMembersChannel,
      category,
    );
    const totalHumanMembersChannel = await createOrUpdateChannel(
      interaction,
      totalHumanMembersChannelName,
      0,
      guildConfigData.totalHumanMembersChannel,
      category,
    );
    const totalBotsChannel = await createOrUpdateChannel(
      interaction,
      totalBotsChannelName,
      0,
      guildConfigData.totalBotsChannel,
      category,
    );

    guildConfigData = {
      serverStatsCategory: category.id,
      totalMembersChannel: totalMembersChannel.id,
      totalHumanMembersChannel: totalHumanMembersChannel.id,
      totalBotsChannel: totalBotsChannel.id,
    };

    await guildConfig.updateOne(guildConfigData);

    await updateServerStats(interaction.guild, guildConfigData);

    await interaction.followUp({
      content: "Server stats setup complete.",
      ephemeral: true,
    });
  } catch (error) {
    process.logger.error({
      user: "Server Stats",
      message: `Error setting up server stats: \n${error.message}`,
    });
    try {
      await interaction.followUp({
        content:
          "An error occurred while setting up server stats. \n" + error.message,
        ephemeral: true,
      });
    } catch (followUpError) {
      process.logger.error({
        user: "Server Stats",
        message: `Error sending follow-up message: \n ${followUpError}`,
      });
    }
  }
}

async function updateServerStats(guild, guildConfig) {
  try {
    const fetchedGuild = await guild.fetch();
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
      /* eslint-disable-next-line no-undef */
      const logger = await process.client.loggers.get(fetchedGuild.id);
      if (logger) {
        await logger.warn({
          message: `I Don't Have Enough Permissions To Update Server Stats.`,
          user: `Server Stats Auto Updater`,
        });
      }
    }
    process.logger.error({
      user: "Server Stats",
      message: `Error updating server stats: \n${error.message}`,
    });
  }
}

module.exports = {
  setupServerStats,
  updateServerStats,
};
