const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "ping",
    description: "Check my ping!",
  },
  run: async ({ client, interaction }) => {
    await interaction.deferReply();
    const PingEmbed = new EmbedBuilder()
      .setColor("#2F3136")
      .setTitle("Client Ping")
      .addFields({
        name: "**Latency**",
        value: `\`${Date.now() - interaction.createdTimestamp}ms\``,
      })
      .addFields({
        name: "**API Latency**",
        value: `\`${Math.round(client.ws.ping)}ms\``,
      })
      .setColor("Blurple")
      .setTimestamp()
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });
    await interaction.editReply({
      embeds: [PingEmbed],
    });
  },
};
