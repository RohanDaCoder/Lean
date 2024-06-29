const { SlashCommandBuilder } = require('discord.js');
const { Slots } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slot-machine')
    .setDescription('Play the Slot Machine game.'),
  run: async ({ interaction }) => {
    try {
      const game = new Slots({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Slot Machine',
          color: '#5865F2'
        },
        slots: ['🍇', '🍊', '🥑', '🥝']
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Slot Machine game:', error);
      await interaction.reply('Failed to start Slot Machine game.');
    }
  },
};