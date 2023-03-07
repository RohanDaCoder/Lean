exports.run = async (client, i, Discord) => {
const { Snake } = require("discord-gamecord")
    new Snake({
      message: i,
      slash_command: true,
      embed: {
        title: 'Snake Game',
        color: '#5865F2',
        OverTitle: 'Game Over',
      },
      snake: { head: ':flushed:', body: '🟩', tail: '🟢' },
      emojis: {
        board: '⬛',
        food: '🍎',
        up: '⬆️', 
        down: '⬇️',
        right: '➡️',
        left: '⬅️',
      }
    }).startGame();
  }
exports.name = "snake"
