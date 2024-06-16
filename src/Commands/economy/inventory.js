const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const InventoryManager = require("../../Util/InventoryManager");
const { items } = require("../../Util/Items");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View Someone's inventory")
    .addUserOption((option) =>
      option
        .setName("user_mention")
        .setDescription("Mention the user whose inventory you want to view")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The ID of the user whose inventory you want to view")
        .setRequired(false),
    ),

  async run({ interaction, client }) {
    let userId =
      interaction.options.getUser("user_mention")?.id ||
      interaction.options.getString("user_id") ||
      interaction.user.id;

    try {
      const user = await client.users.fetch(userId);
      const userInventory = await InventoryManager.GetInventory(userId);

      const inventoryEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${user.tag}'s Inventory`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setTimestamp();
      if (userInventory.length > 0) {
        const itemsList = userInventory
          .map((item, index) => {
            const itemDetails = items.find((i) => i.id === item.id);
            return `${index + 1}. ${itemDetails ? itemDetails.name : "Unknown"} (x${item.quantity})`;
          })
          .join("\n");
        inventoryEmbed.setDescription(itemsList);
      } else {
        inventoryEmbed.setDescription("This user's inventory is empty.");
      }

      await interaction.reply({ embeds: [inventoryEmbed] });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      await interaction.reply(
        "An error occurred while fetching the inventory. \n" + error.message,
      );
    }
  },
  options: {
    botPermissions: ["EmbedLinks"],
  },
};
