const { SlashCommandBuilder } = require('discord.js');
const EconomyManager = require('../../Util/EconomyManager');

const eco = require('../../Util/EconomyManager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weekly')
		.setDescription('Claim Your Weekly Coins'),
	options: {
		cooldown: '1w', // 1 week cooldown
	},
	run: async ({ client, interaction }) => {
		try {
			const userID = interaction.user.id;
			const { db } = await eco.GetProfile(userID);
			const check = db.get('weekly');
			if (check) {
				await interaction.reply({
					content: `${client.config.emojis.no} You have already claimed your weekly prize.`,
					ephemeral: true,
				});
				return;
			}
			else {
				const reward = client.config.rewards.weekly;
				const currentBalance = await eco.GetMoney({
					userID,
					balance: 'wallet',
				});
				await interaction.reply({
					content: `${client.config.emojis.yes} Congratulations! You claimed ${eco.formatMoney(reward)} as your weekly reward.`,
				});
				db.set('wallet', currentBalance.raw + reward);
				// No need to set "weekly" to true since we're using the cooldown system
			}
		}
		catch (error) {
			console.error('Error claiming weekly reward:', error);
			await interaction.reply({
				content: `${client.config.emojis.no} An error occurred while claiming your weekly reward. \n${error.message}`,
				ephemeral: true,
			});
		}
	},
};
