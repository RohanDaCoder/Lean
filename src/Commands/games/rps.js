const { SlashCommandBuilder } = require('discord.js');
const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rock-paper-scissors')
		.setDescription('Play Rock Paper Scissors against another player.')
		.addUserOption((option) =>
			option
				.setName('opponent')
				.setDescription('The user to challenge.')
				.setRequired(true),
		),
	run: async ({ client, interaction }) => {
		try {
			const opponent = interaction.options.getUser('opponent');
			const game = new RockPaperScissors({
				message: interaction,
				isSlashGame: true,
				opponent,
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Rock Paper Scissors game:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to start Rock Paper Scissors game: ${error.message}`,
			);
		}
	},
};
