const {
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

class ButtonManager {
  constructor() {
    this.buttons = [];
    this.collectors = [];
  }

  createButton({ customId, label, style = ButtonStyle.Primary }) {
    const button = new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(style);

    this.buttons.push(button);
    return button;
  }

  createActionRow() {
    const row = new ActionRowBuilder().addComponents(this.buttons);
    this.buttons = []; // Clear buttons after creating a row
    return row;
  }

  disableButtons(row) {
    row.components.forEach((button) => {
      if (button instanceof ButtonBuilder) {
        button.setDisabled(true);
      }
    });
  }

  setupCollector({ interaction, message, time = 30000, onCollect, onEnd }) {
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time,
    });

    collector.on("collect", async (i) => {
      try {
        await onCollect(i);
      } catch (error) {
        console.error("Error handling button click:", error);
        await i.reply({
          content: "An error occurred while processing your request.",
          ephemeral: true,
        });
      }
    });

    collector.on("end", async (collected) => {
      const disabledRow = this.disableButtons(message.components[0]);
      await message.edit({ components: [disabledRow] });
      if (onEnd) {
        onEnd(collected);
      }
    });

    this.collectors.push(collector);
  }
}

module.exports = ButtonManager;
