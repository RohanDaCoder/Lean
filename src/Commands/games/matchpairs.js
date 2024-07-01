const { SlashCommandBuilder } = require("discord.js");
const { MatchPairs } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("matchpairs")
    .setDescription("Play a game of Match Pairs!"),

  run: async ({ client, interaction }) => {
    try {
      const game = new MatchPairs({
        message: interaction,
        isSlashGame: true,
        emojis: [
          "🍉",
          "🍇",
          "🍊",
          "🥭",
          "🍎",
          "🍏",
          "🥝",
          "🥥",
          "🍓",
          "🫐",
          "🍍",
          "🥕",
          "🥔",
        ],
      });

      game.startGame();
    } catch (error) {
      console.error("Error starting Match Pairs game:", error);
      await interaction.reply(
        `${client.config.emojis.no} Failed to start Match Pairs game: ${error.message}`,
      );
    }
  },
};
