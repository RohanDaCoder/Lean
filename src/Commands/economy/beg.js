const EconomyManager = require('../../Util/EconomyManager.js');
const economyManager = require('../../Util/EconomyManager.js');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beg')
		.setDescription('Beg for money'),
	async run({ interaction, client }) {
		const userId = interaction.user.id;
		const beggingResult = Math.random() < 0.75; // 75% chance to receive money
		const earnings = beggingResult ? Math.floor(Math.random() * 200) + 20 : 0; // Earns between $20 and $220 if successful

		if (beggingResult) {
			const walletBalance = await economyManager.GetMoney({
				userID: userId,
				balance: 'wallet',
			});
			await economyManager.SetMoney({
				userID: userId,
				balance: 'wallet',
				amount: walletBalance.raw + earnings,
			});
			await interaction.reply({
				content: `Someone gave you ${economyManager.formatMoney(earnings)}`,
			});
		}
		else {
			await interaction.reply({
				content: 'No one wanted to give you money today.',
			});
		}
	},
	options: {
		cooldown: '5m',
	},
};
