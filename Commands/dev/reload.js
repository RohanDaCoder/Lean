const { SlashCommandBuilder } = require("discord.js");
const ms = require("ms")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload The Bot"),
  async run({ interaction, client, handler }) {
    await interaction.reply("Reloading...");
    const beforeReload = interaction.createdAt;
    await handler.reloadCommands();
    await interaction.channel.send("Reloaded Commands.");
    await handler.reloadEvents();

    const afterReload = new Date();
    await interaction.channel.send(`Reloaded Events. \nDone! Took ${ms(afterReload - beforeReload)}`);
  },
  options: {
    devOnly: true
  }
};