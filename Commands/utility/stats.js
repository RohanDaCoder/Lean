const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Display bot statistics"),
  run: async ({ client, interaction }) => {
    // Fetching values from the client
    const msg = client.channels
      .fetch("1011508935578095626")
      .messages.fetch("1237775445685174382");
    const ping = client.ws.ping;
    const uptime = client.uptime / 1000 / 60;
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2,
    );
    const guildsCount = client.guilds.cache.size;
    const usersCount = client.users.cache.size;
    const apiLatency = Date.now() - interaction.createdTimestamp;
    const version = require("../../package.json").version;
    const discordJSVersion = require("discord.js").version;
    const nodeVersion = process.version;

    // Creating the embed
    const embed = new EmbedBuilder()
      .setColor(6200464)
      .setTitle(`Stats For ${client.user.tag}`)
      .setTimestamp()
      .addFields(
        {
          name: "<a:a_online:1007918346374746133> Ping",
          value: `┕ \`${ping}ms\``,
          inline: true,
        },
        {
          name: ":clock1: Uptime",
          value: `┕ \`${uptime}m\``,
          inline: true,
        },
        {
          name: ":file_cabinet: Memory",
          value: `┕ \`${memoryUsage}mb\``,
          inline: true,
        },
        {
          name: ":homes: Servers",
          value: `┕ \`${guildsCount}\``,
          inline: true,
        },
        {
          name: ":busts_in_silhouette: Users",
          value: `┕ \`${usersCount}\``,
          inline: true,
        },
        {
          name: ":control_knobs: API Latency",
          value: `┕ \`${apiLatency}ms\``,
          inline: true,
        },
        {
          name: ":robot: Version",
          value: `┕ \`${version}\``,
          inline: true,
        },
        {
          name: ":blue_book: Discord.js",
          value: `┕ \`${discordJSVersion}\``,
          inline: true,
        },
        {
          name: ":green_book: Node",
          value: `┕ \`${nodeVersion}\``,
          inline: true,
        },
      );

    // Sending the embed
    await msg.reply({
      embeds: [embed],
    });
  },
};
