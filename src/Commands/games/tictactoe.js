const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tic-tac-toe')
    .setDescription('Play Tic Tac Toe against another player.')
    .addUserOption(option =>
      option.setName('opponent')
        .setDescription('The user to challenge.')
        .setRequired(true)),
  run: async ({ interaction }) => {
    try {
      const opponent = interaction.options.getUser('opponent');
      const game = new TicTacToe({
        message: interaction,
        isSlashGame: true,
        opponent,
        embed: {
          title: 'Tic Tac Toe',
          color: '#5865F2',
          statusTitle: 'Status',
          overTitle: 'Game Over'
        },
        emojis: {
          xButton: '❌',
          oButton: '🔵',
          blankButton: '➖'
        },
        mentionUser: true,
        timeoutTime: 60000,
        xButtonStyle: 'DANGER',
        oButtonStyle: 'PRIMARY',
        turnMessage: '{emoji} | Its turn of player **{player}**.',
        winMessage: '{emoji} | **{player}** won the TicTacToe Game.',
        tieMessage: 'The Game tied! No one won the Game!',
        timeoutMessage: 'The Game went unfinished! No one won the Game!',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Tic Tac Toe game:', error);
      await interaction.reply('Failed to start Tic Tac Toe game.');
    }
  },
};