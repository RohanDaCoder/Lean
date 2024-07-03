const { SlashCommandBuilder } = require('discord.js');
const { Minesweeper } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minesweeper')
		.setDescription('Play a game of Minesweeper!'),

	run: async ({ client, interaction }) => {
		try {
			const game = new Minesweeper({
				message: interaction,
				isSlashGame: true,
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Minesweeper game:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to start Minesweeper game: ${error.message}`,
			);
		}
	},
};
