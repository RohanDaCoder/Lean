const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tic-tac-toe')
		.setDescription('Play Tic Tac Toe against another player.')
		.addUserOption((option) =>
			option
				.setName('opponent')
				.setDescription('The user to challenge.')
				.setRequired(true),
		),
	run: async ({ client, interaction }) => {
		try {
			const opponent = interaction.options.getUser('opponent');
			const game = new TicTacToe({
				message: interaction,
				isSlashGame: true,
				opponent,
				mentionUser: true,
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Tic Tac Toe game:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to start Tic Tac Toe game: ${error.message}`,
			);
		}
	},
};
