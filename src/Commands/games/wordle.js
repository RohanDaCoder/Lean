const { SlashCommandBuilder } = require('discord.js');
const { Wordle } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Play the Wordle game.'),
  run: async ({ interaction }) => {
    try {
      const game = new Wordle({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Wordle',
          color: '#5865F2'
        },
        timeoutTime: 60000,
        winMessage: 'You won! The word was **{word}**.',
        loseMessage: 'You lost! The word was **{word}**.'
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Wordle game:', error);
      await interaction.reply('Failed to start Wordle game.');
    }
  },
};