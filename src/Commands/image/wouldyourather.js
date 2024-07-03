const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	options: {
		botPermissions: ['EmbedLinks', 'AddReactions'],
	},
	data: new SlashCommandBuilder()
		.setName('wouldyourather')
		.setDescription('Fetches a \'Would You Rather\' question.'),

	async run({ interaction, client }) {
		try {
			await interaction.deferReply();

			// Fetch the WYR question from the API
			const response = await axios.get('https://api.popcat.xyz/wyr');
			const { ops1, ops2 } = response.data;

			// Create the embed with the WYR question and options
			const embed = new EmbedBuilder()
				.setTitle('Would You Rather...')
				.setDescription(`**Options:**\n\n:one: ${ops1}\n:two: ${ops2}`)
				.setColor('Random')
				.setTimestamp();

			// Send the embed message
			const message = await interaction.editReply({ embeds: [embed] });

			// React with :one: and :two:
			await message.react('1️⃣');
			await message.react('2️⃣');
		}
		catch (error) {
			console.error('Error fetching WYR question:', error);
			await interaction.editReply({
				content: `${client.config.emojis.no} An error occurred while trying to fetch the 'Would You Rather' question. \n${error.message}`,
				ephemeral: true,
			});
		}
	},
};
