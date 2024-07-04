const { WebhookClient, EmbedBuilder } = require("discord.js");
const path = require("path");
const Database = require("calm.db");

class GuildLogger {
  constructor(guildId) {
    this.guildId = guildId;
    this.dbFilePath = path.join(
      __dirname,
      `../Database/Guilds/${guildId}.json`,
    );
    this.database = new Database(this.dbFilePath);
  }

  async getWebhook() {
    return await this.database.get("guildlogger");
  }

  async log({ message, user, additionalInfo }) {
    const webhookUrl = await this.getWebhook();
    if (!webhookUrl) {
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Log")
      .setDescription(`New Message From ${user}`)
      .addFields(
        {
          name: "Message",
          value: message,
        },
        {
          name: "Additional Info",
          value: additionalInfo || "None",
        },
      )
      .setColor("#00FF00")
      .setTimestamp()
      .setFooter({
        text: "Lean Logger V1",
        iconURL: process.client.user.displayAvatarURL({ dynamic: false }),
      });

    const webhook = new WebhookClient({ url: webhookUrl });
    await webhook.send({ embeds: [embed] });
  }

  async warn({ message, user, additionalInfo }) {
    const webhookUrl = await this.getWebhook();
    if (!webhookUrl) {
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Warning")
      .setDescription(`New Warning From ${user}`)
      .addFields(
        {
          name: "Message",
          value: message,
        },
        {
          name: "Additional Info",
          value: additionalInfo || "None",
        },
      )
      .setColor("#FFA500")
      .setTimestamp()
      .setFooter({
        text: "Lean Logger V1",
        iconURL: process.client.user.displayAvatarURL({ dynamic: false }),
      });

    const webhook = new WebhookClient({ url: webhookUrl });
    await webhook.send({ embeds: [embed] });
  }

  async error({ message, user, additionalInfo }) {
    const webhookUrl = await this.getWebhook();
    if (!webhookUrl) {
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(`Error From ${user}`)
      .addFields(
        {
          name: "Message",
          value: message,
        },
        {
          name: "Additional Info",
          value: additionalInfo || "None",
        },
      )
      .setColor("#FF0000")
      .setTimestamp()
      .setFooter({
        text: "Lean Logger V1",
        iconURL: process.client.user.displayAvatarURL({ dynamic: false }),
      });

    const webhook = new WebhookClient({ url: webhookUrl });
    await webhook.send({ embeds: [embed] });
  }
}

module.exports = GuildLogger;
