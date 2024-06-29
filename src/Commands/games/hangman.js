const { SlashCommandBuilder } = require('discord.js');
const { Hangman } = require('discord-gamecord');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Play a game of Hangman!'),
  run: async ({ interaction }) => {
    try {
      // Fetch a random word from the API
      const response = await axios.get('https://random-word-api.herokuapp.com/word');
      const randomWord = response.data[0]; // Extract the first word from the response array

      const game = new Hangman({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Hangman',
          color: '#5865F2',
        },
        hangman: { hat: '🎩', head: '😳', shirt: '👕', pants: '🩳', boots: '👞👞' },
        customWord: randomWord,
        timeoutTime: 60000,
        theme: 'nature',
        winMessage: 'You won! The word was **{word}**.',
        loseMessage: 'You lost! The word was **{word}**.',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Hangman game:', error);
      await interaction.reply('Failed to start Hangman game.');
    }
  },
};