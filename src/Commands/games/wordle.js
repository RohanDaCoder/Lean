const { SlashCommandBuilder } = require('discord.js');
const { Wordle } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordle')
		.setDescription('Play the Wordle game.'),
	run: async ({ client, interaction }) => {
		try {
			const game = new Wordle({
				message: interaction,
				isSlashGame: true,
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Wordle game:', error);
			await interaction.reply(
				`${client.config.emojis.no} An error occurred while starting the Wordle game: ${error.message}`,
			);
		}
	},
};
