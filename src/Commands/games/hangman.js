const { SlashCommandBuilder } = require('discord.js');
const { Hangman } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hangman')
		.setDescription('Play a game of Hangman!'),

	run: async ({ client, interaction }) => {
		try {
			const game = new Hangman({
				message: interaction,
				isSlashGame: true,
				hangman: {
					hat: '🎩',
					head: '😳',
					shirt: '👕',
					pants: '🩳',
					boots: '👞👞',
				},
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Hangman game:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to start Hangman game: ${error.message}`,
			);
		}
	},
};
