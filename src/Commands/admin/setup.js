const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { setupServerStats } = require("../../Util/ServerStatsUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Set up various configurations for the server.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server-stats")
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
    ),
  async run({ interaction, client }) {
    try {
      // Handle subcommands
      if (interaction.options.getSubcommand() === "server-stats") {
        await interaction.deferReply();
        await setupServerStats({ interaction, client });
      } else {
        // Unknown subcommand
        await interaction.reply({
          content: "Unknown subcommand.",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error setting up server:", error);
      await interaction.reply({
        content:
          "An error occurred while setting up server configurations. \n" +
          error.message,
        ephemeral: true,
      });
    }
  },
  options: {
    botPermissions: [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.ManageChannels,
    ],
  },
};
