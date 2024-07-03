const { SlashCommandBuilder } = require('discord.js');
const { GuessThePokemon } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guessthepokemon')
		.setDescription('Play a game of Guess The Pokemon!'),

	run: async ({ client, interaction }) => {
		try {
			const game = new GuessThePokemon({
				message: interaction,
				isSlashGame: true,
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Guess The Pokemon game:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to start Guess The Pokemon game.`,
			);
		}
	},
};
