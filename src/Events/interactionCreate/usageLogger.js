const Discord = require("discord.js");
module.exports = async (interaction, client) => {
  const user = interaction.user;
  if (!interaction.commandName) return;

  const usageEmbed = new Discord.EmbedBuilder()
    .setTitle(`Usage Logger`)
    .setAuthor({
      name: user.tag || "Unknown",
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .addFields(
      {
        name: "Name",
        value: user.tag || "Unknown",
      },
      {
        name: "Guild",
        value: interaction.guild.name || "Unknown",
      },
      {
        name: "Channel",
        value: interaction.channel.name || "Unknown",
      },
      {
        name: "Command",
        value: interaction.commandName || "Unknown",
      },
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor("Random");

  await process.usageChannel.send({ embeds: [usageEmbed] });
};
