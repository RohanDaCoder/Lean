const { TwoZeroFourEight } = require('discord-gamecord');

module.exports = {
  data: {
    name: '2048',
    description: 'Play a game of 2048!',
  },
  run: async ({ interaction, client, handler }) => {
    const game = new TwoZeroFourEight({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: '2048',
        color: '#5865F2'
      },
      emojis: {
        up: '⬆️',
        down: '⬇️',
        left: '⬅️',
        right: '➡️',
      },
      timeoutTime: 60000,
      buttonStyle: 'PRIMARY',
      playerOnlyMessage: 'Only {player} can use these buttons.'
    });

    game.startGame();
  },
};