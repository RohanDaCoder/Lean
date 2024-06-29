const { SlashCommandBuilder } = require('discord.js');
const { Trivia } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Play the Trivia game.')
    .addStringOption(option =>
      option
        .setName('difficulty')
        .setDescription('Select the difficulty level.')
        .setRequired(true)
        .addChoices([
          { name: 'Easy', value: 'easy' },
          { name: 'Medium', value: 'medium' },
          { name: 'Hard', value: 'hard' }
        ]),
    )
    .addStringOption(option =>
      option
        .setName('mode')
        .setDescription('Select the game mode.')
        .setRequired(true)
        .addChoices([
          { name: 'Multiple Choice', value: 'multiple' },
          { name: 'True/False', value: 'single' }
        ]),
    ),
  run: async ({ interaction }) => {
    try {
      const difficulty = interaction.options.getString('difficulty');
      const mode = interaction.options.getString('mode');

      const game = new Trivia({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Trivia',
          color: '#5865F2',
          description: 'You have 60 seconds to guess the answer.'
        },
        mode: mode === 'single' ? 'single' : 'multiple',
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        trueButtonStyle: 'SUCCESS',
        falseButtonStyle: 'DANGER',
        difficulty: difficulty,
        winMessage: 'You won! The correct answer is {answer}.',
        loseMessage: 'You lost! The correct answer is {answer}.',
        errMessage: 'Unable to fetch question data! Please try again.'
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Trivia game:', error);
      await interaction.reply('Failed to start Trivia game.');
    }
  },
};