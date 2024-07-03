const { SlashCommandBuilder } = require('discord.js');
const { Flood } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flood')
		.setDescription('Play a game of Flood!')
		.addIntegerOption((option) =>
			option
				.setName('difficulty')
				.setDescription('Choose the difficulty level.')
				.setRequired(true)
				.addChoices(
					{ name: 'Easy Mode', value: 8 },
					{ name: 'Normal Mode', value: 13 },
					{ name: 'Hard Mode', value: 18 },
				),
		),
	run: async ({ client, interaction }) => {
		const difficulty = interaction.options.getInteger('difficulty');

		try {
			const game = new Flood({
				message: interaction,
				isSlashGame: true,
				difficulty: difficulty,
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Flood game:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to start Flood game.`,
			);
		}
	},
};
