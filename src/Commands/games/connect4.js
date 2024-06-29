const { SlashCommandBuilder } = require('discord.js');
const { Connect4 } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('connect4')
    .setDescription('Play a game of Connect 4!')
    .addUserOption(option => 
      option.setName('user')
      .setDescription('The user you want to play against')
      .setRequired(true)
    ),
  run: async ({ interaction, client, handler }) => {
    const opponent = interaction.options.getUser('user');
    const game = new Connect4({
      message: interaction,
      isSlashGame: true,
      opponent: opponent,
      embed: {
        title: 'Connect 4 Game',
        statusTitle: 'Status',
        color: '#5865F2'
      },
      emojis: {
        board: '⚪',
        player1: '🔴',
        player2: '🟡'
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: 'PRIMARY',
      turnMessage: '{emoji} | It\'s the turn of player **{player}**.',
      winMessage: '{emoji} | **{player}** won the Connect 4 Game.',
      tieMessage: 'The game tied! No one won the game!',
      timeoutMessage: 'The game went unfinished! No one won the game!',
      playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
    });

    game.startGame();
  },
};