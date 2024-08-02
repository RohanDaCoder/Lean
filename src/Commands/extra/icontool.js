const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");
const config = require("../../config.js");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("icontool")
    .setDescription("Free Fire Icon Tool")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Search by item name")
        .setRequired(true),
    ),

  async run({ interaction }) {
    try {
      await interaction.deferReply();

      let index = 0;
      const response = await axios.get(
        "https://cdn.jsdelivr.net/gh/jinix6/ItemID@main/ob45.json",
      );
      const items = response.data;
      let results = [];

      const nameOption = interaction.options.getString("name");

      if (nameOption) {
        results = items.filter((item) =>
          item.description?.toLowerCase().includes(nameOption.toLowerCase()),
        );
        if (results.length === 0) {
          return interaction.editReply(
            `${config.emojis.no} No item found with name containing "${nameOption}"`,
          );
        }
      } else {
        return interaction.editReply(
          `${config.emojis.no} Please provide a name to search.`,
        );
      }

      const getItemEmbed = (item) => {
        const iconURL = `https://raw.githubusercontent.com/jinix6/Icon/main/webp/${item.icon}.webp`;
        return new EmbedBuilder()
          .setTitle("FF Icon Tool")
          .addFields(
            { name: "Item ID", value: item.itemID || "None" },
            { name: "Icon", value: item.icon || "None" },
            { name: "Description", value: item.description || "None" },
            { name: "Additional Description", value: item.description2 || "None" },
            { name: "Index", value: `${index}` },
          )
          .setImage(iconURL)
          .setThumbnail(iconURL)
          .setColor("Random")
          .setFooter({
            text: "Icons By jinix6",
            iconURL: `https://avatars.githubusercontent.com/jinix6`,
          })
          .setTimestamp();
      };

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous ◀️")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next ▶️")
          .setStyle(ButtonStyle.Secondary),
      );

      await interaction.editReply({
        embeds: [getItemEmbed(results[index])],
        components: [row],
      });

      const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        try {
          await i.deferUpdate();
          if (i.customId === "previous") {
            index = (index - 1 + results.length) % results.length;
          } else if (i.customId === "next") {
            index = (index + 1) % results.length;
          }
          await interaction.editReply({
            embeds: [getItemEmbed(results[index])],
            components: [row],
          });
        } catch (error) {
          console.error("Error handling button interaction:", error);
        }
      });

      collector.on("end", async () => {
        try {
          await interaction.editReply({ components: [] });
        } catch (error) {
          console.error("Error removing components:", error);
        }
      });
    } catch (error) {
      console.error("Error fetching icon data:", error);
      await interaction.editReply({
        content: `${config.emojis.no} An error occurred while trying to fetch the data.`,
        ephemeral: true,
      });
    }
  },
};