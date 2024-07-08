const { ChannelType } = require("discord.js");
const logger = require("../BotLogger");
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
    logger.error({
      user: "Server Stats",
      message: `Error creating or updating channel: ${error.message}`,
    });
  }
}

async function updateChannelName(guild, channelId, name) {
  try {
    const channel = await guild.channels.fetch(channelId);
    if (channel) {
      await channel.edit({ name });
    }
  } catch (error) {
    if (error.code === 50001) {
      return;
    }
    logger.error({
      user: "Server Stats",
      message: `Error updating channel name: \n${error.message}`,
    });
  }
}

async function channelExists(guild, channelId) {
  try {
    const channel = await guild.channels.fetch(channelId);
    return !!channel;
  } catch {
    return false;
  }
}

module.exports = {
  createOrUpdateChannel,
  updateChannelName,
  channelExists,
};
