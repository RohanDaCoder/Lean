const { SlashCommandBuilder } = require('discord.js');
const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rock-paper-scissors')
    .setDescription('Play Rock Paper Scissors against another player.')
    .addUserOption(option =>
      option.setName('opponent')
        .setDescription('The user to challenge.')
        .setRequired(true)),
  run: async ({ interaction }) => {
    try {
      const opponent = interaction.options.getUser('opponent');
      const game = new RockPaperScissors({
        message: interaction,
        isSlashGame: true,
        opponent,
        embed: {
          title: 'Rock Paper Scissors',
          color: '#5865F2',
          description: 'Press a button below to make a choice.'
        },
        buttons: {
          rock: 'Rock',
          paper: 'Paper',
          scissors: 'Scissors'
        },
        emojis: {
          rock: '🌑',
          paper: '📰',
          scissors: '✂️'
        },
        mentionUser: true,
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        pickMessage: 'You choose {emoji}.',
        winMessage: '**{player}** won the Game! Congratulations!',
        tieMessage: 'The Game tied! No one won the Game!',
        timeoutMessage: 'The Game went unfinished! No one won the Game!',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
      });

      game.startGame();
    } catch (error) {
      console.error('Error starting Rock Paper Scissors game:', error);
      await interaction.reply('Failed to start Rock Paper Scissors game.');
    }
  },
};