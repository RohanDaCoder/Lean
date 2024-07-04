const {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Temporarily mutes a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration of the mute (e.g., 10m, 1h, 1d)")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for muting the user")
        .setRequired(false),
    ),

  run: async ({ interaction, client }) => {
    const target = interaction.options.getMember("user");
    const muteDuration = interaction.options.getString("duration");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    function ms(duration) {
      const matches = duration.match(/(\d+)([smhd])/);
      if (!matches) {return null;}

      const [time, unit] = matches;
      const durations = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
      return time * durations[unit];
    }

    const milliseconds = ms(muteDuration);

    if (!milliseconds) {
      return interaction.reply({
        content: `${client.config.emojis.no} Incorrect duration format.`,
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply({ ephemeral: true });

      const confirmButton = new ButtonBuilder()
        .setCustomId("confirm-mute")
        .setLabel("Confirm Mute")
        .setStyle(ButtonStyle.Danger);

      const cancelButton = new ButtonBuilder()
        .setCustomId("cancel-mute")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary);

      const buttonRow = new ActionRowBuilder().addComponents(
        cancelButton,
        confirmButton,
      );

      await interaction.followUp({
        content: `Are you sure you want to mute ${target.user.tag} for ${muteDuration}?`,
        components: [buttonRow],
        ephemeral: true,
      });

      const buttonFilter = (btn) =>
        ["confirm-mute", "cancel-mute"].includes(btn.customId) &&
        btn.user.id === interaction.user.id;
      const buttonCollector =
        interaction.channel.createMessageComponentCollector({
          buttonFilter,
          time: 60000,
        });

      buttonCollector.on("collect", async (btn) => {
        if (btn.customId === "confirm-mute") {
          try {
            await target.timeout(milliseconds, reason);

            const muteEmbed = new EmbedBuilder()
              .setColor(0xffa500)
              .setTitle("User Muted")
              .addFields(
                { name: "Muted User", value: target.user.tag },
                { name: "Muted By", value: interaction.user.tag },
                { name: "Duration", value: muteDuration },
                { name: "Reason", value: reason },
              )
              .setTimestamp();

            const guildLogger = await client.loggers.get(interaction.guild.id);
            if (guildLogger) {
              await guildLogger.log({
                message: `User ${target.user.tag} muted by ${interaction.user.tag} for ${muteDuration}. Reason: ${reason}`,
                user: interaction.user.tag,
                additionalInfo: `User ID: ${target.id}`,
              });
            }

            await btn.update({
              content: `${client.config.emojis.yes} User successfully muted.`,
              embeds: [muteEmbed],
              components: [],
            });
          } catch (error) {
            console.error("Error muting user:", error);
            await btn.update({
              content: `${client.config.emojis.no} An error occurred while muting the user: ${error.message}`,
              components: [],
              ephemeral: true,
            });
          }
        } else if (btn.customId === "cancel-mute") {
          await btn.update({
            content: `${client.config.emojis.no} Mute action has been canceled.`,
            components: [],
            ephemeral: true,
          });
        }
      });

      buttonCollector.on("end", (collected) => {
        if (collected.size === 0) {
          interaction.followUp({
            content: "No action was taken.",
            components: [],
          });
        }
      });
    } catch (error) {
      console.error("Error initiating mute process:", error);
      await interaction.reply({
        content: `${client.config.emojis.no} An error occurred while processing the mute command: ${error.message}`,
        ephemeral: true,
      });
    }
  },

  options: {
    userPermissions: ["MuteMembers"],
    botPermissions: ["MuteMembers"],
  },
};
