const { SlashCommandBuilder } = require('discord.js');
const { Trivia } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Play the Trivia game.')
		.addStringOption((option) =>
			option
				.setName('difficulty')
				.setDescription('Select the difficulty level.')
				.setRequired(true)
				.addChoices([
					{ name: 'Easy', value: 'easy' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'Hard', value: 'hard' },
				]),
		)
		.addStringOption((option) =>
			option
				.setName('mode')
				.setDescription('Select the game mode.')
				.setRequired(true)
				.addChoices([
					{ name: 'Multiple Choice', value: 'multiple' },
					{ name: 'True/False', value: 'single' },
				]),
		),
	run: async ({ client, interaction }) => {
		try {
			const difficulty = interaction.options.getString('difficulty');
			const mode = interaction.options.getString('mode');

			const game = new Trivia({
				message: interaction,
				isSlashGame: true,
				mode: mode === 'single' ? 'single' : 'multiple',
				difficulty: difficulty,
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Trivia game:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to start Trivia game: ${error.message}`,
			);
		}
	},
};
