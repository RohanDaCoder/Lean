const { SlashCommandBuilder } = require('discord.js');
const { Flood } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flood')
    .setDescription('Play a game of Flood!')
    .addIntegerOption(option =>
      option.setName('difficulty')
        .setDescription('Choose the difficulty level.')
        .setRequired(true)
        .addChoices(
          { name: 'Easy Mode', value: 8 },
          { name: 'Normal Mode', value: 13 },
          { name: 'Hard Mode', value: 18 }
        )
    ),
  run: async ({ interaction, client, handler }) => {
    const difficulty = interaction.options.getInteger('difficulty');

    const game = new Flood({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: 'Flood',
        color: '#5865F2',
      },
      difficulty: difficulty,
      timeoutTime: 60000,
      buttonStyle: 'PRIMARY',
      emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
      winMessage: 'You won! You took **{turns}** turns.',
      loseMessage: 'You lost! You took **{turns}** turns.',
      playerOnlyMessage: 'Only {player} can use these buttons.'
    });

    game.startGame();
  },
};