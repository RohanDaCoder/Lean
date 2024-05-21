const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const InventoryManager = require("../../Util/InventoryManager");

const actionChoices = [
  { name: "Add", value: "add" },
  { name: "Remove", value: "remove" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Modify someone's inventory")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Action (add or remove)")
        .addChoices(actionChoices)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item to add or remove")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user whose inventory you want to modify")
        .setRequired(true),
    ),

  async run({ client, interaction }) {
    const userId = interaction.options.getUser("user").id;
    const action = interaction.options.getString("action").toLowerCase();
    const item = interaction.options.getString("item");

    await interaction.deferReply();
    try {
      const inventoryManager = new InventoryManager();
      let userInventory = await inventoryManager.getInventory(userId);

      if (action === "add") {
        userInventory.push(item);
      } else if (action === "remove") {
        userInventory = userInventory.filter((invItem) => invItem !== item);
      }

      await inventoryManager.setInventory(userId, userInventory);

      const user = await client.users.fetch(userId);
      const title = `${action === "add" ? "Added" : "Removed"} Item`;

      const inventoryEmbed = new EmbedBuilder()
        .setTitle(title)
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .addFields({
          name: `Updated Inventory`,
          value: userInventory.length > 0 ? userInventory.join(", ") : "Empty",
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [inventoryEmbed] });
    } catch (error) {
      console.error("Error modifying inventory:", error);
      await interaction.editReply(
        "An error occurred while modifying the inventory. \n" + error.message,
      );
    }
  },
  options: { devOnly: true },
};
