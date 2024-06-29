const { SlashCommandBuilder } = require('discord.js');
const { MatchPairs } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('matchpairs')
    .setDescription('Play a game of Match Pairs!'),
  run: async ({ interaction }) => {
    try {
      const game = new MatchPairs({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Match Pairs',
          color: '#5865F2',
          description: '**Click on the buttons to match emojis with their pairs.**'
        },
        timeoutTime: 60000,
        emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
        winMessage: '**You won the Game! You turned a total of `{tilesTurned}` tiles.**',
        loseMessage: '**You lost the Game! You turned a total of `{tilesTurned}` tiles.**',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Match Pairs game:', error);
      await interaction.reply('Failed to start Match Pairs game.');
    }
  },
};