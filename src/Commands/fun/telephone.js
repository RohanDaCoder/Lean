const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const lobbyQueue = [];
const activeChats = new Map();
const chatTimeouts = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("telephone")
    .setDescription("Use the bot as a telephone to chat across servers")
    .addSubcommand((subcommand) =>
      subcommand.setName("join").setDescription("Join the telephone lobby"),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("leave").setDescription("Leave the current chat"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("chat")
        .setDescription("Send a message to the other person")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to send")
            .setRequired(true),
        ),
    ),
  async run({ interaction, client }) {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "join") {
        await joinLobby(interaction, client);
      } else if (subcommand === "leave") {
        await leaveChat(interaction, client);
      } else if (subcommand === "chat") {
        await sendMessage(interaction, client);
      }
    } catch (error) {
      console.error("Error occurred in command execution:", error);
      await interaction.reply({
        content: `${client.config.emojis.no} There was an error while executing the command. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
  options: {
    botPermissions: ["EmbedLinks"],
  },
};

async function joinLobby(interaction, client) {
  try {
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;

    if (
      lobbyQueue.some((entry) => entry.userId === userId) ||
      activeChats.has(userId)
    ) {
      await interaction.reply({
        content: `${client.config.emojis.no} You are already in the lobby or in an active chat.`,
        ephemeral: true,
      });
      return;
    }

    lobbyQueue.push({ userId, channelId });
    await interaction.reply({
      content: `${client.config.emojis.yes} You have joined the lobby. Waiting for another user...`,
      ephemeral: true,
    });

    if (lobbyQueue.length >= 2) {
      const [user1, user2] = [lobbyQueue.shift(), lobbyQueue.shift()];

      activeChats.set(user1.userId, {
        partnerId: user2.userId,
        channelId: user1.channelId,
      });
      activeChats.set(user2.userId, {
        partnerId: user1.userId,
        channelId: user2.channelId,
      });

      const [user1Obj, user2Obj] = await Promise.all([
        client.users.fetch(user1.userId),
        client.users.fetch(user2.userId),
      ]);
      const [channel1, channel2] = await Promise.all([
        client.channels.fetch(user1.channelId),
        client.channels.fetch(user2.channelId),
      ]);

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Connection Established")
        .setDescription(
          `${user1Obj.username} and ${user2Obj.username}, you are now connected! \nUse \`/telephone chat\` to send messages.`,
        )
        .setTimestamp();

      await channel1.send({ embeds: [embed] });
      await channel2.send({ embeds: [embed] });

      resetChatTimeout(user1.userId, user2.userId, client);
    }
  } catch (error) {
    console.error("Error occurred in joinLobby function:", error);
    await interaction.reply({
      content: `${client.config.emojis.no} There was an error while joining the lobby. \n${error.message}`,
      ephemeral: true,
    });
  }
}

async function sendMessage(interaction, client) {
  try {
    const userId = interaction.user.id;

    if (!activeChats.has(userId)) {
      await interaction.reply({
        content: `${client.config.emojis.no} You are not in an active chat. \nUse \`/telephone join\` to join a chat.`,
        ephemeral: true,
      });
      return;
    }

    const { partnerId } = activeChats.get(userId);
    const message = interaction.options.getString("message");

    const partnerChannelId = activeChats.get(partnerId).channelId;
    const partnerChannel = await client.channels.fetch(partnerChannelId);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription(message)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await partnerChannel.send({ embeds: [embed] });
    await interaction.reply({ embeds: [embed] });

    resetChatTimeout(userId, partnerId, client);
  } catch (error) {
    console.error("Error occurred in sendMessage function:", error);
    await interaction.reply({
      content: `${client.config.emojis.no} There was an error while sending the message. \n${error.message}`,
      ephemeral: true,
    });
  }
}

async function leaveChat(interaction, client) {
  try {
    const userId = interaction.user.id;

    if (!activeChats.has(userId)) {
      await interaction.reply({
        content: `${client.config.emojis.no} You are not in an active chat.`,
        ephemeral: true,
      });
      return;
    }

    const { partnerId, channelId } = activeChats.get(userId);

    // Notify both users that someone left the chat
    const [user1] = await Promise.all([
      client.users.fetch(userId),
      client.users.fetch(partnerId),
    ]);
    const [channel1, channel2] = await Promise.all([
      client.channels.fetch(channelId),
      client.channels.fetch(activeChats.get(partnerId).channelId),
    ]);

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("Chat Ended")
      .setDescription(
        `${user1.username} has left the chat. \nUse \`/telephone join\` to join another chat.`,
      )
      .setTimestamp();

    await channel1.send({ embeds: [embed] });
    await channel2.send({ embeds: [embed] });

    // Clean up active chat and timeout
    activeChats.delete(userId);
    activeChats.delete(partnerId);

    if (chatTimeouts.has(userId)) {
      clearTimeout(chatTimeouts.get(userId));
      chatTimeouts.delete(userId);
    }
    if (chatTimeouts.has(partnerId)) {
      clearTimeout(chatTimeouts.get(partnerId));
      chatTimeouts.delete(partnerId);
    }

    await interaction.reply({
      content: `${client.config.emojis.yes} You have left the chat.`,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error occurred in leaveChat function:", error);
    await interaction.reply({
      content: `${client.config.emojis.no} There was an error while leaving the chat. \n${error.message}`,
      ephemeral: true,
    });
  }
}

function resetChatTimeout(user1, user2, client) {
  try {
    if (chatTimeouts.has(user1)) {
      clearTimeout(chatTimeouts.get(user1));
    }
    if (chatTimeouts.has(user2)) {
      clearTimeout(chatTimeouts.get(user2));
    }

    const timeout = setTimeout(async () => {
      const [channel1, channel2] = await Promise.all([
        client.channels.fetch(activeChats.get(user1)?.channelId),
        client.channels.fetch(activeChats.get(user2)?.channelId),
      ]);

      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Chat Closed")
        .setDescription("The chat has been closed due to inactivity.")
        .setTimestamp();

      if (channel1) {
        await channel1.send({ embeds: [embed] });
      }
      if (channel2) {
        await channel2.send({ embeds: [embed] });
      }

      activeChats.delete(user1);
      activeChats.delete(user2);
      chatTimeouts.delete(user1);
      chatTimeouts.delete(user2);
    }, 120000); // 2 minutes

    chatTimeouts.set(user1, timeout);
    chatTimeouts.set(user2, timeout);
  } catch (error) {
    console.error("Error occurred in resetChatTimeout function:", error);
  }
}
