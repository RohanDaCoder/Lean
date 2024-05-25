const { EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: {
    name: "ping",
    description: "Pong!",
  },
  run: async ({ interaction, client, handler }) => {
    const msg = await interaction.reply("Pinging...");
    const before = interaction.createdAt;

    const clientPing = ms(Math.round(client.ws.ping));
    const after = new Date();
    const apiPing = ms(after - before);
    const pingEmbed = new EmbedBuilder()
      .setTitle(`Latency`)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({
          dynamic: true,
        }),
      })
      .addFields(
        {
          name: "Client Ping",
          value: clientPing,
        },
        {
          name: "API Ping",
          value: apiPing,
        },
      )
      .setColor("Random")
      .setTimestamp();

    await msg.edit({
      embeds: [pingEmbed],
      content: "Pinged..",
    });
  },
};
