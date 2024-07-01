const { SlashCommandBuilder } = require("discord.js");
const { Snake } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snake")
    .setDescription("Play a game of Snake."),

  run: async ({ client, interaction }) => {
    try {
      const Game = new Snake({
        message: interaction,
        isSlashGame: true,
        snake: { head: ":flushed:", body: "🟩", tail: "🟢", over: "💀" },
        foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
      });

      Game.startGame();
    } catch (error) {
      console.error("Error starting Snake game:", error);
      await interaction.reply(
        `${client.config.emojis.no} Failed to start Snake game: ${error.message}`,
      );
    }
  },

  options: {
    cooldown: "15s",
    botPermissions: ["EmbedLinks"],
  },
};
