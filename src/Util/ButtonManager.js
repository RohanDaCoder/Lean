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

  createButton({
    customId,
    label,
    style = ButtonStyle.Primary,
    disabled = false,
  }) {
    const button = new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(style)
      .setDisabled(disabled);

    this.buttons.push(button);
    return button;
  }

  createActionRow() {
    const row = new ActionRowBuilder().addComponents(this.buttons);
    this.buttons = [];
    return row;
  }

  setupCollector({ message, time = 30000, onCollect, onEnd }) {
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time,
    });

    collector.on("collect", async (i) => {
      try {
        await onCollect(i);
      } catch {
        await i.reply({
          content: "An error occurred while processing your request.",
          ephemeral: true,
        });
      }
    });

    collector.on("end", async (collected) => {
      if (onEnd) {
        onEnd(collected);
      }
    });

    this.collectors.push(collector);
  }
}

module.exports = ButtonManager;
