const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user from the server."),

  async run({ interaction, client }) {
    const guild = interaction.guild;

    try {
      await interaction.deferReply({ ephemeral: true });

      const bans = await guild.bans.fetch({ cache: false });

      if (bans.size === 0) {
        return interaction.editReply({
          content: "There are no banned users in this server.",
          ephemeral: true,
        });
      }

      const options = bans.map((ban) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(ban.user.tag)
          .setDescription(`ID: ${ban.user.id}`)
          .setValue(ban.user.id),
      );

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("unban-select")
        .setPlaceholder("Select a user to unban")
        .addOptions(options);

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.editReply({
        content: "Please select a user to unban:",
        components: [row],
        ephemeral: true,
      });

      const filter = (i) =>
        i.customId === "unban-select" && i.user.id === interaction.user.id;

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        const userId = i.values[0];
        const selectedBan = bans.get(userId);

        const confirmButton = new ButtonBuilder()
          .setCustomId("confirm-unban")
          .setLabel("Confirm Unban")
          .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
          .setCustomId("cancel-unban")
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Secondary);

        const buttonRow = new ActionRowBuilder().addComponents(
          cancelButton,
          confirmButton,
        );

        await i.update({
          content: `Are you sure you want to unban ${selectedBan.user.tag}?`,
          components: [buttonRow],
          ephemeral: true,
        });

        const buttonFilter = (btn) =>
          ["confirm-unban", "cancel-unban"].includes(btn.customId) &&
          btn.user.id === interaction.user.id;

        const buttonCollector =
          interaction.channel.createMessageComponentCollector({
            buttonFilter,
            time: 60000,
          });

        buttonCollector.on("collect", async (btn) => {
          if (btn.customId === "confirm-unban") {
            try {
              await guild.bans.remove(userId);

              const unbanEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("User Unbanned")
                .addFields(
                  {
                    name: "Unbanned User",
                    value: selectedBan.user.tag,
                    inline: true,
                  },
                  {
                    name: "Unbanned By",
                    value: interaction.user.tag,
                    inline: true,
                  },
                )
                .setTimestamp()
                .setFooter({
                  text: `User ID: ${userId}`,
                  iconURL: interaction.guild.iconURL(),
                });

              await btn.update({
                content: null,
                embeds: [unbanEmbed],
                components: [],
              });

              // Log unban action
              const guildLogger = await client.loggers.get(
                interaction.guild.id,
              );
              if (guildLogger) {
                await guildLogger.log({
                  message: `${interaction.user.tag} unbanned ${selectedBan.user.tag} from <#${interaction.channel.id}>.`,
                  user: interaction.user.tag,
                });
              }
            } catch (error) {
              console.error("Error unbanning user:", error);
              await btn.update({
                content: "An error occurred while unbanning the user.",
                components: [],
                ephemeral: true,
              });
            }
          } else if (btn.customId === "cancel-unban") {
            await btn.update({
              content: "Unban action has been canceled.",
              components: [],
              ephemeral: true,
            });
          }
        });

        buttonCollector.on("end", (collected) => {
          if (collected.size === 0) {
            i.update({ content: "No action was taken.", components: [] });
          }
        });
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          interaction.editReply({
            content: "No selection was made.",
            components: [],
          });
        }
      });
    } catch (error) {
      console.error("Error fetching bans:", error);
      await interaction.editReply({
        content: "An error occurred while fetching bans.",
        ephemeral: true,
      });
    }
  },

  options: {
    devOnly: false,
    userPermissions: ["BanMembers"],
    botPermissions: ["BanMembers"],
  },
};
