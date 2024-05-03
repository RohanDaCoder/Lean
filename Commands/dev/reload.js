const { SlashCommandBuilder } = require("discord.js");
import prettyMS from "pretty-ms";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload The Bot"),
  async run({ interaction, client, handler }) {
    await interaction.reply("Reloading...");
    const beforeReload = interaction.createdAt;
    await handler.reloadCommands();
    await interaction.followUp("Reloaded Commands.");
    await handler.reloadEvents();

    const afterReload = new Date();
    await interaction.followUp(`Reloaded Events. \nDone! Took ${prettyMS(afterReload - beforeReload)}`);
  },
  options: {
    devOnly: true
  }
};