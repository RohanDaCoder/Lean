const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const EconomyManager = require('../../Util/EconomyManager.js');
const economyManager = require('../../Util/EconomyManager.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to earn money'),

	async run({ client, interaction }) {
		const userId = interaction.user.id;
		const earnings = Math.floor(Math.random() * 500) + 50;
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
			content: `You worked hard and earned ${economyManager.formatMoney(earnings)}.`,
		});
	},
	options: {
		cooldown: '1h',
	},
};
