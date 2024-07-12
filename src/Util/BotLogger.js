const { WebhookClient, EmbedBuilder } = require("discord.js");

class BotLogger {
  constructor() {
    this.webhookClient = new WebhookClient({ url: process.env.botLogs });
  }

  log({
    message,
    user,
    guild,
    command,
    causedByUser,
    causedByCommand,
    additionalInfo,
  }) {
    const embed = new EmbedBuilder()
      .setTitle("Log")
      .setDescription(message)
      .setColor("Random")
      .setFooter({ text: "Lean Logger V1" })
      .setTimestamp();

    if (user) {
      embed.addFields({ name: "User", value: user, inline: true });
    }
    if (guild) {
      embed.addFields({ name: "Guild", value: guild, inline: true });
    }
    if (command) {
      embed.addFields({ name: "Command", value: command, inline: true });
    }
    if (causedByUser) {
      embed.addFields({
        name: "Caused by User",
        value: causedByUser,
        inline: true,
      });
    }
    if (causedByCommand) {
      embed.addFields({
        name: "Caused by Command",
        value: causedByCommand,
        inline: true,
      });
    }
    if (additionalInfo) {
      embed.addFields({ name: "Additional Info", value: additionalInfo });
    }

    this.webhookClient.send({ embeds: [embed] });
  }

  warn({
    message,
    user,
    guild,
    command,
    causedByUser,
    causedByCommand,
    additionalInfo,
  }) {
    const embed = new EmbedBuilder()
      .setTitle("Warning")
      .setDescription(message)
      .setColor("Yellow")
      .setFooter({ text: "Lean Logger V1" })
      .setTimestamp();

    if (user) {
      embed.addFields({ name: "User", value: user, inline: true });
    }
    if (guild) {
      embed.addFields({ name: "Guild", value: guild, inline: true });
    }
    if (command) {
      embed.addFields({ name: "Command", value: command, inline: true });
    }
    if (causedByUser) {
      embed.addFields({
        name: "Caused by User",
        value: causedByUser,
        inline: true,
      });
    }
    if (causedByCommand) {
      embed.addFields({
        name: "Caused by Command",
        value: causedByCommand,
        inline: true,
      });
    }
    if (additionalInfo) {
      embed.addFields({ name: "Additional Info", value: additionalInfo });
    }

    this.webhookClient.send({ embeds: [embed] });
  }

  error({
    message,
    user,
    guild,
    command,
    causedByUser,
    causedByCommand,
    additionalInfo,
  }) {
    const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(message)
      .setColor("Red")
      .setFooter({ text: "Lean Logger V1" })
      .setTimestamp();

    if (user) {
      embed.addFields({ name: "User", value: user, inline: true });
    }
    if (guild) {
      embed.addFields({ name: "Guild", value: guild, inline: true });
    }
    if (command) {
      embed.addFields({ name: "Command", value: command, inline: true });
    }
    if (causedByUser) {
      embed.addFields({
        name: "Caused by User",
        value: causedByUser,
        inline: true,
      });
    }
    if (causedByCommand) {
      embed.addFields({
        name: "Caused by Command",
        value: causedByCommand,
        inline: true,
      });
    }
    if (additionalInfo) {
      embed.addFields({
        name: "Additional Info",
        value: `Info: \n${additionalInfo}`,
      });
    }

    this.webhookClient.send({ embeds: [embed] });
  }
}

module.exports = new BotLogger();
