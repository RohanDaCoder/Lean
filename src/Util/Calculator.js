const { evaluate } = require("mathjs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

class Calculator {
  constructor(options = {}) {
    if (!options.interaction) {
      throw new TypeError(`Calculator Error: interaction must be provided.`);
    }

    const {
      interaction,
      embed = {},
      disabledQuery = "Calculator is disabled!",
      invalidQuery = "The provided equation is invalid!",
      othersMessage = "Only <@{{author}}> can use the buttons!",
    } = options;

    this.options = {
      interaction,
      embed,
      disabledQuery,
      invalidQuery,
      othersMessage,
    };
    this.str = " ";
    this.stringify = "```\n" + this.str + "\n```";
    this.buttons = this.createButtons();
    this.disabled = false;
  }

  createButtons() {
    const buttonLabels = [
      "(",
      ")",
      "^",
      "%",
      "AC",
      "7",
      "8",
      "9",
      "÷",
      "DC",
      "4",
      "5",
      "6",
      "x",
      "⌫",
      "1",
      "2",
      "3",
      "-",
      "\u200b",
      ".",
      "0",
      "=",
      "+",
      "\u200b",
    ];

    let buttons = [];
    for (let i = 0; i < buttonLabels.length; i += 5) {
      let row = new ActionRowBuilder();
      for (let j = i; j < i + 5; j++) {
        if (buttonLabels[j] !== "\u200b") {
          row.addComponents(this.createButton(buttonLabels[j]));
        }
      }
      buttons.push(row);
    }
    return buttons;
  }

  createButton(label) {
    let style = ButtonStyle.Secondary;
    if (["AC", "DC", "⌫"].includes(label)) {
      style = ButtonStyle.Success;
    } else if (label === "=") {
      style = ButtonStyle.Danger;
    }

    const btn = new ButtonBuilder()
      .setLabel(label)
      .setStyle(style)
      .setCustomId("cal" + label);
    return btn;
  }

  async start() {
    const { interaction } = this.options;

    const embed = new EmbedBuilder()
      .setTitle(this.options.embed.title || "Calculator")
      .setDescription(this.stringify)
      .setColor(this.options.embed.color || "Blurple")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setFooter({ text: this.options.embed.footer || "Lean" });

    if (this.options.embed.timestamp) embed.setTimestamp();

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: this.buttons,
    });

    const collector = initialMessage.createMessageComponentCollector();

    collector.on("collect", async (btn) => {
      if (btn.user.id !== interaction.user.id) {
        return btn.reply({
          content: this.options.othersMessage.replace(
            "{{author}}",
            interaction.user.id,
          ),
          ephemeral: true,
        });
      }
      await btn.deferUpdate();
      switch (btn.customId) {
        case "calAC":
          this.str = " ";
          break;
        case "calx":
          this.str += "*";
          break;
        case "cal÷":
          this.str += "/";
          break;
        case "cal⌫":
          this.str = this.str.slice(0, -1);
          break;
        case "cal=":
          try {
            this.str = evaluate(this.str).toString();
          } catch {
            this.str = this.options.invalidQuery;
          }
          break;
        case "calDC":
          this.str = this.options.disabledQuery;
          this.disabled = true;
          collector.stop();
          break;
        default:
          if (this.str === this.options.invalidQuery) {
            this.str = "";
          }
          this.str += btn.customId.replace("cal", "");
          break;
      }

      if (this.str.trim() === "") {
        this.stringify = "```\n \n```";
      } else {
        this.stringify = "```\n" + this.str + "\n```";
      }

      await this.edit(initialMessage);
    });
  }

  async edit(msg) {
    const embed = new EmbedBuilder()
      .setTitle(this.options.embed.title || "Calculator")
      .setDescription(this.stringify)
      .setColor(this.options.embed.color || "Blurple")
      .setAuthor({
        name: this.options.interaction.user.username,
        iconURL: this.options.interaction.user.displayAvatarURL(),
      })
      .setFooter({ text: this.options.embed.footer || "Lean" });

    if (this.options.embed.timestamp) embed.setTimestamp();

    if (this.disabled) {
      this.buttons.forEach((row) => {
        row.components.forEach((button) => {
          button.setDisabled(true);
        });
      });
    }

    await msg.edit({ embeds: [embed], components: this.buttons });
  }
}

module.exports = Calculator;
