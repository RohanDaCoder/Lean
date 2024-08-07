const { SlashCommandBuilder } = require("discord.js");
const Database = require("calm.db");
const path = require("path");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-welcomer")
    .setDescription("Setup Welcomer For This Server")
    .addChannelOption((channel) =>
      channel
        .setName("welcomer-channel")
        .setDescription("Channel to send welcome messages to.")
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("replace-channel")
        .setDescription(
          "If Welcome Channel Is Already Set, Do You Want To Replace It?",
        )
        .setRequired(false),
    ),

  async run({ interaction, client }) {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("welcomer-channel");
    const config = new Database(
      path.join(
        __dirname,
        `../../Database/Guilds/${interaction.guild.id}.json`,
      ),
    );
    const welcomeID = await config.get("welcomeChannel");
    const replaceID =
      interaction.options.getBoolean("replace-channel") || false;
    // If Welcome Channel is Not Set

    if (!welcomeID || replaceID === true) {
      config.set("welcomeChannel", channel.id);
      await interaction.editReply({
        content: `${client.config.emojis.yes} You Have Successfully Set The Welcome Channel To ${channel}`,
      });
      return;
    }

    // If There Is a Saved Channel ID But Replace Channel ID Isnt True
    if (welcomeID && replaceID === false) {
      await interaction.editReply({
        content: `${client.config.emojis.no} The Welcome Channel Is Already Set To <#${welcomeID}>, \nIf You Want To Change The Welcome Channel, You Need To Set Replace Channel To True.`,
      });
      return;
    }
  },
  options: {
    userPermissions: ["ManageServer"],
    botPermissions: ["ManageChannels", "EmbedLinks", "SendMessages"],
  },
};
