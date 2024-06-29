module.exports = {
  data: {
    name: "snake",
    description: "Play a game of Snake.",
  },

  run: async ({ client, interaction, Discord }) => {
    const { Snake } = require("discord-gamecord");
    const Game = new Snake({
  message: interaction,
  isSlashGame: true,
  embed: {
    title: 'Snake Game',
    overTitle: 'Game Over',
    color: '#5865F2'
  },
  emojis: {
    board: '⬛',
    food: '🍎',
    up: '⬆️', 
    down: '⬇️',
    left: '⬅️',
    right: '➡️',
  },
  stopButton: 'Stop',
  timeoutTime: 60000,
  snake: { head: ':flushed:', body: '🟩', tail: '🟢', over: '💀' },
  foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
  playerOnlyMessage: 'Only {player} can use these buttons.'
});

Game.startGame();
  },
  options: {
    cooldown: "15s",
    botPermissions: ["EmbedLinks"],
  },
};
