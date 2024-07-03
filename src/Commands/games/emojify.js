const { SlashCommandBuilder } = require('discord.js');
const { Emojify } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emojify')
		.setDescription('Convert text to emojis!')
		.addStringOption((option) =>
			option
				.setName('text')
				.setDescription('The text to convert to emojis')
				.setRequired(true),
		),
	run: async ({ client, interaction }) => {
		try {
			const text = interaction.options.getString('text');
			const emojifiedText = await Emojify(text);

			await interaction.reply(emojifiedText);
		}
		catch (error) {
			console.error('Error in emojify command:', error);
			await interaction.reply(
				`${client.config.emojis.no} Failed to emojify the text.`,
			);
		}
	},
};
