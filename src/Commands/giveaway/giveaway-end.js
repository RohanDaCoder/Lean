const { ApplicationCommandOptionType } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("giveaway-end")
  .setDescription("🎉 End an already running giveaway")
  .addStringOption((option) =>
    option
      .setName("giveaway")
      .setDescription("The giveaway to end (message ID or giveaway prize)")
      .setRequired(true),
  );

module.exports = {
  data,
  run: async ({ client, interaction }) => {
    // If the member doesn't have enough permissions
    if (
      !interaction.member.permissions.has("ManageMessages") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content: `${client.config.emojis.no} You need to have the manage messages permissions to end giveaways.`,
        ephemeral: true,
      });
    }

    const query = interaction.options.getString("giveaway");

    // fetching the giveaway with message Id or prize
    const giveaway =
      // Search with giveaway prize
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === query && g.guildId === interaction.guild.id,
      ) ||
      // Search with giveaway Id
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === query && g.guildId === interaction.guild.id,
      );

    // If no giveaway was found with the corresponding input
    if (!giveaway) {
      return interaction.reply({
        content:
          client.config.emojis.no +
          " Unable to find a giveaway for `" +
          query +
          "`.",
        ephemeral: true,
      });
    }

    if (giveaway.ended) {
      return interaction.reply({
        content: `${client.config.emojis.no} This giveaway has already ended!`,
        ephemeral: true,
      });
    }

    // Edit the giveaway
    client.giveawaysManager
      .end(giveaway.messageId)
      // Success message
      .then(() => {
        // Success message
        interaction.reply(
          `${client.config.emojis.yes} **[This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** Has Now Ended!`,
        );
      })
      .catch((e) => {
        interaction.reply({
          content: e,
          ephemeral: true,
        });
      });
  },
};
