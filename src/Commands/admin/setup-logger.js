const { SlashCommandBuilder, ChannelType } = require("discord.js");
const Database = require("../../Util/Database");
const ms = require("ms");
const path = require("path");
const { WebhookClient } = require("discord.js");
const data = new SlashCommandBuilder()
  .setName("setup-logger")
  .setDescription("Set up a log channel to listen for logs and warnings");
module.exports = {
  data,
  async run({ interaction, client }) {
    await interaction.deferReply();
    //Define Variables
    const guild = interaction.guild;
    let logChannel;
    let webhook;
    const loggersDB = new Database(
      path.join(__dirname, "../../Database/loggers.json"),
    );
    //If Logger Is already setuped
    if (await loggersDB.has(guild.id)) {
      await interaction.editReply({
        content: `${client.config.emojis.no} ${guild.name}'s Log Channel Has Been Already Set!`,
        ephemeral: true,
      });
      return;
    }

    try {
      const before = interaction.createdAt;
      await interaction.followUp(`Starting Setup...`);
      const lowerCaseUsername = client.user.username.toLowerCase();
      //Create The Log Channel
      logChannel = await guild.channels.create({
        name: `${lowerCaseUsername}-logs`,
        type: ChannelType.GuildText,
        reason: `Create Log Channel For ${client.user.username}`,
      });
      await interaction.followUp(
        `${client.config.emojis.yes} Created Channel ${logChannel}, Creating Webhook...`,
      );
      //Create The Log Webhook
      webhook = await guild.channels.createWebhook({
        channel: logChannel.id,
        name: `${lowerCaseUsername} Logger`,
        avatar: client.user.displayAvatarURL({ dynamic: false }),
        reason: `Create Logger Webhook For ${client.user.username}`,
      });
      await interaction.followUp(
        `${client.config.emojis.yes} Created Webhook, Finishing....`,
      );
      await loggersDB.set(guild.id, webhook.url);
      const after = new Date();
      const timeTook = ms(after - before);
      await interaction.followUp(
        `${client.config.emojis.yes} Successfully Setuped Log Channel To ${logChannel}. \nTook ${timeTook}`,
      );
    } catch (error) {
      console.error(`Error While Setuping Logger In ${guild.name}: \n${error}`);
      await interaction.followUp({
        content: `${client.config.emojis.no} An Error Occured While Setuping The Log Channel. \n${error.message}\nReversing Setup..`,
        ephemeral: true,
      });

      await webhook.delete(`Error While Setuping Logger.`);
      await guild.channels.delete(logChannel.id, `Error While Setuping Logger`);
      await loggersDB.delete(guild.id);
    }
  },
  options: {
    userPermissions: ["ManageGuild", "ManageChannels"],
    botPermissions: ["ManageWebhooks", "EmbedLinks", "ManageChannels"],
  },
};
