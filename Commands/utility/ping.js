const { EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: {
    name: 'ping',
    description: 'Pong!',
  },
  run: async ({ interaction, client, handler }) => {
    await interaction.reply("Pinging...");
    const before = interaction.createdAt;

    const clientPing = ms(Math.round(client.ws.ping));
    const after = new Date();
    const apiPing = ms(afterReload - beforeReload);
    const pingEmbed = new EmbedBuilder()
      .setTitle(`Ping Of ${client.user.username}`)
      .addFields({
        name: "Client Ping",
        value: clientPing
      },
      {
        name: "API Ping",
        value: apiPing
      })
      .setColor("Random")
      .addTimestamp()

    await interaction.followUp({ embeds: [pingEmbed] });
  }
};