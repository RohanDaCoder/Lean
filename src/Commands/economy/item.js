const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getItemChoices } = require("../../Util/Items");
const inv = require("../../Util/InventoryManager");

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
        .setRequired(true)
        .addChoices(actionChoices),
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item to add or remove")
        .setRequired(true)
        .addChoices(getItemChoices()),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of the item to add or remove")
        .setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("user_mention")
        .setDescription("Mention the user whose inventory you want to modify")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The ID of the user whose inventory you want to modify")
        .setRequired(false),
    ),

  async run({ client, interaction }) {
    let userId =
      interaction.options.getUser("user_mention")?.id ||
      interaction.options.getString("user_id") ||
      interaction.user.id;
    const action = interaction.options.getString("action").toLowerCase();
    const itemId = interaction.options.getString("item");
    const amount = interaction.options.getInteger("amount") || 1;

    await interaction.deferReply();
    try {
      let userInventory = await inv.GetInventory(userId);

      if (action === "add") {
        await inv.AddItem(userId, itemId, amount);
      } else if (action === "remove") {
        await inv.RemoveItem(userId, itemId, amount);
      }

      userInventory = await inv.GetInventory(userId);

      const user = await client.users.fetch(userId);
      const title = `${action === "add" ? "Added" : "Removed"} ${amount} ${amount === 1 ? "item" : "items"}`;

      const itemsList =
        userInventory.length > 0
          ? userInventory
              .map(
                (item, index) =>
                  `${index + 1}. ${item.name} (x${item.quantity})`,
              )
              .join("\n")
          : "This user's inventory is empty.";

      const inventoryEmbed = new EmbedBuilder()
        .setTitle(title)
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(itemsList)
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
