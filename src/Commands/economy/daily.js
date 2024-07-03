const { SlashCommandBuilder } = require('discord.js');
const EconomyManager = require('../../Util/EconomyManager');

const eco = require('../../Util/EconomyManager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claim Your Daily Coins'),
	options: {
		cooldown: '1d', // 1 day cooldown
	},
	run: async ({ interaction, client }) => {
		try {
			const userID = interaction.user.id;
			const { default: prettyMS } = await import('pretty-ms');
			const { db } = await eco.GetProfile(userID);
			const lastClaimTime = db.get('daily');
			if (lastClaimTime) {
				await interaction.reply({
					content: `${client.config.emojis.no} You have already claimed your daily prize.`,
					ephemeral: true,
				});
				return;
			}
			else {
				const reward = client.config.rewards.daily;
				const currentBalance = await eco.GetMoney({
					userID,
					balance: 'wallet',
				});
				await interaction.reply({
					content: `${client.config.emojis.yes} Congratulations! You claimed ${eco.formatMoney(reward)} as your daily reward.`,
				});
				db.set('wallet', currentBalance.raw + reward);
				db.set('daily', Date.now());
			}
		}
		catch (error) {
			console.error('Error claiming daily reward:', error);
			await interaction.reply({
				content: `${client.config.emojis.no} An error occurred while claiming your daily reward. \n${error.message}`,
				ephemeral: true,
			});
		}
	},
};
