const { SlashCommandBuilder } = require("discord.js");
const { Connect4 } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("connect4")
    .setDescription("Play a game of Connect 4!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to play against")
        .setRequired(true),
    ),
  run: async ({ client, interaction }) => {
    try {
      const opponent = interaction.options.getUser("user");
      const game = new Connect4({
        message: interaction,
        isSlashGame: true,
        opponent: opponent,
        mentionUser: true,
      });

      game.startGame();
    } catch (error) {
      console.error("Error starting Connect 4 game:", error);
      await interaction.reply(
        `${client.config.emojis.no} Failed to start Connect 4 game.`,
      );
    }
  },
};
