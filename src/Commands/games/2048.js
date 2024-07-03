const { SlashCommandBuilder } = require("discord.js");
const { TwoZeroFourEight } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("2048")
    .setDescription("Play a game of 2048!"),

  async run({ client, interaction }) {
    try {
      const game = new TwoZeroFourEight({
        message: interaction,
        isSlashGame: true,
      });

      game.startGame();
    } catch (error) {
      console.error("Error starting 2048 game:", error);
      await interaction.reply(
        `${client.config.emojis.no} Failed to start 2048 game.`,
      );
    }
  },
};
