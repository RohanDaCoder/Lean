const { SlashCommandBuilder } = require('discord.js');
const { FindEmoji } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('findemoji')
		.setDescription('Play a game of Find Emoji!'),
	run: async ({ client, interaction }) => {
		try {
			const game = new FindEmoji({
				message: interaction,
				isSlashGame: true,
				emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
			});

			game.startGame();
		}
		catch (error) {
			console.error('Error starting Find Emoji game:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to start Find Emoji game.`,
			);
		}
	},
};
