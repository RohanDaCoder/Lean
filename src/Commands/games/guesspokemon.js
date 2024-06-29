const { SlashCommandBuilder } = require('discord.js');
const { GuessThePokemon } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guesspokemon')
    .setDescription('Play a game of Guess The Pokemon!'),
  run: async ({ interaction }) => {
    try {
      const game = new GuessThePokemon({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: "Who's The Pokemon",
          color: '#5865F2',
        },
        timeoutTime: 60000,
        winMessage: 'You guessed it right! It was a {pokemon}.',
        loseMessage: 'Better luck next time! It was a {pokemon}.',
        errMessage: 'Unable to fetch pokemon data! Please try again.',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Guess The Pokemon game:', error);
      await interaction.reply('Failed to start Guess The Pokemon game.');
    }
  },
};