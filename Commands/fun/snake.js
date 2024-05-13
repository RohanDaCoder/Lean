module.exports = {
  data: {
    name: "snake",
    description: "Play a game of Snake.",
  },

  run: async ({ client, interaction, Discord }) => {
    const { Snake } = require("discord-gamecord");
    new Snake({
      message: interaction,
      slash_command: true,
      embed: {
        title: "Snake Game",
        color: "#5865F2",
        OverTitle: "Game Over",
      },
      snake: { head: ":flushed:", body: "🟩", tail: "🟢" },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        down: "⬇️",
        right: "➡️",
        left: "⬅️",
      },
    }).startGame();
  },
  options: {
  cooldown: "15s"
  }
};
