const { SlashCommandBuilder, ButtonStyle } = require("discord.js");
const ButtonManager = require("../../Util/ButtonManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Buy Or Sell Things In The Shop"),
  async run({ interaction }) {
    const buttonManager = new ButtonManager();

    const buyButton = buttonManager.createButton({
      customId: "buy",
      label: "Buy",
      style: ButtonStyle.Primary,
    });

    const sellButton = buttonManager.createButton({
      customId: "sell",
      label: "Sell",
      style: ButtonStyle.Danger,
    });

    const row = buttonManager.createActionRow();

    await interaction.deferReply(); // Defer the reply

    const message = await interaction.editReply({
      content: "Choose an option:",
      components: [row],
      fetchReply: true,
    });

    buttonManager.setupCollector({
      interaction,
      message,
      time: 30000, // Default time is 30 seconds
      onCollect: async (i) => {
        try {
          if (i.customId === "buy") {
            await i.reply({
              content: `${i.user} clicked the Buy button!`,
              ephemeral: true,
            });
          } else if (i.customId === "sell") {
            await i.reply({
              content: `${i.user} clicked the Sell button!`,
              ephemeral: true,
            });
          }
        } catch (error) {
          console.error("Error during button interaction:", error);
          await i.reply({
            content: "An error occurred while processing your request.",
            ephemeral: true,
          });
        }
      },
      onEnd: (collected) => {
        console.log(`Collected ${collected.size} items`);
      },
    });
  },
};
