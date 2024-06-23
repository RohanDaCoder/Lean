const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { emojis } = process.config;

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("icontool")
    .setDescription("Free Fire Icon Tool"),

  async run({ interaction }) {
    try {
      await interaction.deferReply();
      let index = 0;
      const response = await axios.get("https://raw.githubusercontent.com/jinix6/Icon/main/OB44.json");
      const item = response.data[index];
      if(!item) return interaction.editReply(`${emojis.no} No Data Found.`)
      const iconURL = `https://raw.githubusercontent.com/jinix6/Icon/main/webp/${item.icon}.webp`;
      const embed = new EmbedBuilder()
        .setTitle("FF Icon Tool")
        .addFields({
        	name: "Item ID",
        	value: item.itemID || "None"
        }, {
         name: "Icon",
         value: item.icon || "None"
        }, {
        	name: "Description",
        	value: item.description || "None"
        })
        .setImage(iconURL)
        .setThumbnail(iconURL)
        .setColor("Random")
        .setFooter({
        	text: "Icons By jinix6",
        	iconURL: `https://avatars.githubusercontent.com/jinix6`
        })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error fetching fact:", error);
      await interaction.editReply({
        content: emojis.no + " An error occurred while trying to start the Tool.",
        ephemeral: true,
      });
    }
  },
};
