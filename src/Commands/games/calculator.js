const { SlashCommandBuilder } = require('discord.js');
const Calculator = require('../../Util/Calculator');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculator')
		.setDescription('Open a calculator!'),

	async run({ client, interaction }) {
		try {
			const calc = new Calculator({
				interaction,
				embed: {
					title: 'Calculator',
					color: '#5865F2',
					footer: 'Lean',
					timestamp: true,
				},
				disabledQuery: 'Calculator is disabled!',
				invalidQuery: 'The provided equation is invalid!',
				othersMessage: 'Only <@{{author}}> can use the buttons!',
			});
			await calc.start();
		}
		catch (error) {
			console.error('Error starting calculator:', error);
			await interaction.reply(`${client.config.emojis.no} ${error.message}`);
		}
	},
};
