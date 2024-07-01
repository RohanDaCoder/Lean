const { SlashCommandBuilder } = require("discord.js");
const { Slots } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slot-machine")
    .setDescription("Play the Slot Machine game."),

  run: async ({ client, interaction }) => {
    try {
      const game = new Slots({
        message: interaction,
        isSlashGame: true,
        slots: ["🍇", "🍊", "🥑", "🥝"],
      });

      game.startGame();
    } catch (error) {
      console.error("Error starting Slot Machine game:", error);
      await interaction.reply(
        `${client.config.emojis.no} Failed to start Slot Machine game: ${error.message}`,
      );
    }
  },
};
