const { SlashCommandBuilder, ButtonStyle } = require("discord.js");
const ButtonManager = require("../../Util/ButtonManager");
const { items, getItemChoices } = require("../../Util/Items");
const EconomyManager = require("../../Util/EconomyManager");
const InventoryManager = require("../../Util/InventoryManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Buy or sell items in the shop")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Choose an action")
        .setRequired(true)
        .addChoices(
          { name: "Buy", value: "buy" },
          { name: "Sell", value: "sell" },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Select an item")
        .setRequired(true)
        .addChoices(...getItemChoices()),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount to buy or sell")
        .setRequired(false)
        .setMinValue(1),
    ),
  async run({ interaction, client }) {
    try {
      const action = interaction.options.getString("action");
      const itemId = interaction.options.getString("item");
      const amount = interaction.options.getInteger("amount") || 1;
      const item = items.find((i) => i.id === itemId);

      if (!item) {
        return interaction.reply({
          content: "Item not found.",
          ephemeral: false,
        });
      }

      const buttonManager = new ButtonManager();

      const confirmButton = buttonManager.createButton({
        customId: "confirm",
        label: "Confirm",
        style: ButtonStyle.Primary,
      });

      const cancelButton = buttonManager.createButton({
        customId: "cancel",
        label: "Cancel",
        style: ButtonStyle.Secondary,
      });

      const row = buttonManager.createActionRow();

      await interaction.deferReply();

      const actionMessage =
        action === "buy"
          ? `You are about to buy **${amount} ${item.name}** for **${item.value * amount} coins**.\n\nDo you want to confirm this purchase?`
          : `You are about to sell **${amount} ${item.name}** for **${Math.floor(item.value * amount * 0.7)} coins**.\n\nDo you want to confirm this sale?`;

      const message = await interaction.editReply({
        content: actionMessage,
        components: [row],
        fetchReply: true,
      });

      buttonManager.setupCollector({
        interaction,
        message,
        time: 30000,
        onCollect: async (i) => {
          try {
            const userID = i.user.id;
            if (i.customId === "confirm") {
              if (action === "buy") {
                const balance = await EconomyManager.GetMoney({
                  userID,
                  balance: "wallet",
                });

                if (balance.raw < item.value * amount) {
                  return await i.reply({
                    content: "You do not have enough coins to buy this item.",
                    ephemeral: false,
                  });
                }

                // Deduct the item value from user's wallet
                await EconomyManager.SetMoney({
                  userID,
                  amount: balance.raw - item.value * amount,
                  balance: "wallet",
                });
                // Add the item to the user's inventory
                await InventoryManager.AddItem(userID, item.id, amount);

                await interaction.editReply({
                  content: `You have successfully bought **${amount} ${item.name}**!`,
                  components: [],
                });
              } else if (action === "sell") {
                const inventory = await InventoryManager.GetInventory(userID);
                const inventoryItem = inventory.find((i) => i.id === item.id);

                if (!inventoryItem || inventoryItem.quantity < amount) {
                  return await i.reply({
                    content: "You do not have enough of this item to sell.",
                    ephemeral: false,
                  });
                }

                // Add the sale value to user's wallet
                const saleValue = Math.floor(item.value * amount * 0.7);
                const currentBalance = await EconomyManager.GetMoney({
                  userID,
                  balance: "wallet",
                });
                await EconomyManager.SetMoney({
                  userID,
                  amount: currentBalance.raw + saleValue,
                  balance: "wallet",
                });
                // Remove the item from the user's inventory
                await InventoryManager.RemoveItem(userID, item.id, amount);

                await interaction.editReply({
                  content: `You have successfully sold **${amount} ${item.name}** for **${saleValue} coins**!`,
                  components: [],
                });
              }
            } else if (i.customId === "cancel") {
              await i.reply({
                content: "Action canceled.",
                ephemeral: false,
              });
            }
          } catch (error) {
            console.error("Error during button interaction:", error);
            await i.reply({
              content: "An error occurred while processing your request.",
              ephemeral: false,
            });
          }
        },
        onEnd: async (collected) => {
          try {
            console.log(`Collected ${collected.size} interactions`);
          } catch (error) {
            console.error("Error during collector end:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error executing shop command:", error);
      await interaction.reply({
        content: "An error occurred while executing the shop command.",
        ephemeral: false,
      });
    }
  },
};
