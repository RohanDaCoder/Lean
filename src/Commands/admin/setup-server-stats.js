const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { setupServerStats } = require("../../Util/ServerStatsUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-server-stats")
    .setDescription("Set up a category for displaying server stats.")
    .addStringOption((option) =>
      option
        .setName("category-name")
        .setDescription("Name for the category.")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("total-members-channel-name")
        .setDescription("Name for the total members channel.")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("total-human-members-channel-name")
        .setDescription("Name for the total human members channel.")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("total-bots-channel-name")
        .setDescription("Name for the total bots channel.")
        .setRequired(false),
    ),

  async run({ interaction, client }) {
    try {
      await interaction.deferReply();
      await setupServerStats({ interaction, client });
    } catch (error) {
      console.error("Error setting up server stats:", error);
      await interaction.reply({
        content: `An error occurred while setting up server stats. \n${error.message}`,
        ephemeral: true,
      });
    }
  },
  options: {
    botPermissions: [
      "ManageChannels",
    ],
    userPermissions: [
      "ManageServer",
    ],
  },
};
