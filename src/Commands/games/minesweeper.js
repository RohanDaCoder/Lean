const { SlashCommandBuilder } = require('discord.js');
const { Minesweeper } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minesweeper')
    .setDescription('Play a game of Minesweeper!'),
  run: async ({ interaction }) => {
    try {
      const game = new Minesweeper({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Minesweeper',
          color: '#5865F2',
          description: 'Click on the buttons to reveal the blocks except mines.'
        },
        emojis: { flag: '🚩', mine: '💣' },
        mines: 5, // Number of mines in the game (adjust as needed)
        timeoutTime: 60000, // Timeout duration in milliseconds
        winMessage: 'You won the Game! You successfully avoided all the mines.',
        loseMessage: 'You lost the Game! Be aware of the mines next time.',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Minesweeper game:', error);
      await interaction.reply('Failed to start Minesweeper game.');
    }
  },
};