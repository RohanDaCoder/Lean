const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const GuildLogger = require("../../Util/GuildLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Clears a specified number of messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to clear")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(300),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();

    const amount = interaction.options.getInteger("amount");
    const maxMessagesPerBatch = 100;
    let messagesToDelete = amount;

    const confirmButton = new ButtonBuilder()
      .setCustomId('confirm-purge')
      .setLabel('Confirm Purge')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel-purge')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const actionRow = new ActionRowBuilder()
      .addComponents(confirmButton, cancelButton);

    const guildLogger = new GuildLogger(interaction.guild.id);

    try {
      await interaction.editReply({
        content: `Are you sure you want to purge **${amount}** messages?`,
        components: [actionRow],
        ephemeral: true,
      });

      const filter = i => i.user.id === interaction.user.id && ['confirm-purge', 'cancel-purge'].includes(i.customId);
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

      collector.on('collect', async i => {
        if (i.customId === 'confirm-purge') {
          let totalDeleted = 0;

          try {
            while (messagesToDelete > 0) {
              const currentBatchSize = Math.min(messagesToDelete, maxMessagesPerBatch);
              const deletedMessages = await interaction.channel.bulkDelete(currentBatchSize, true);
              totalDeleted += deletedMessages.size;
              messagesToDelete -= deletedMessages.size;

              await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            await interaction.followUp({
              content: `${client.config.emojis.yes} Successfully deleted **${totalDeleted}** messages.`,
              components: [],
              ephemeral: true,
            });

            await guildLogger.log({
              message: `**${totalDeleted}** messages were purged by ${interaction.user.tag} in ${interaction.channel}`,
              user: interaction.user.tag,
              additionalInfo: `Deleted **${totalDeleted}** messages`,
            });

          } catch (error) {
            console.error(error);
            await interaction.followUp({
              content: `${client.config.emojis.no} There was an error trying to purge messages in this channel. \n${error.message}`,
              components: [],
              ephemeral: true,
            });

            await guildLogger.error({
              message: `Error purging messages in ${interaction.channel}`,
              user: interaction.user.tag,
              additionalInfo: error.message,
            });
          }
        } else if (i.customId === 'cancel-purge') {
          await interaction.followUp({
            content: 'Purge action has been canceled.',
            components: [],
            ephemeral: true,
          });

          await guildLogger.warn({
            message: `Purge action canceled in ${interaction.channel}`,
            user: interaction.user.tag,
          });
        }
      });

      collector.on('end', () => {
        if (interaction.replied) {
          interaction.editReply({ components: [] });
        }
      });

    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: `${client.config.emojis.no} An error occurred while processing your request.`,
        ephemeral: true,
      });

      await guildLogger.error({
        message: `Error processing purge command in ${interaction.channel}`,
        user: interaction.user.tag,
        additionalInfo: error.message,
      });
    }
  },

  options: {
    userPermissions: ["ManageMessages"],
    botPermissions: ["ManageMessages"],
  },
};