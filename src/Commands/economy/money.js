const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { emojis } = require('../../config');
const EconomyManager = require('../../Util/EconomyManager');

// Define transaction types and action choices
const transactionTypes = [
	{ name: 'Wallet', value: 'wallet' },
	{ name: 'Bank', value: 'bank' },
];
const actionChoices = [
	{ name: 'Add', value: 'add' },
	{ name: 'Reduce', value: 'reduce' },
	{ name: 'Set', value: 'set' },
];

// Function to format money
function formatMoney(amount) {
	if (amount >= 1000 && amount < 1000000) {return `${(amount / 1000).toFixed(1)}k`;}
	else if (amount >= 1000000) {return `${(amount / 1000000).toFixed(1)}m`;}
	else {return amount.toLocaleString();}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('money')
		.setDescription('Modify Someone\'s Balance')
		.addStringOption((option) =>
			option
				.setName('action')
				.setDescription('Action (add, reduce, or set)')
				.addChoices(actionChoices)
				.setRequired(true),
		)
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription('Amount of Money')
				.setRequired(true)
				.setMinValue(0),
		)
		.addStringOption((option) =>
			option
				.setName('transaction_type')
				.setDescription('Type of Transaction')
				.addChoices(transactionTypes)
				.setRequired(true),
		)
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The User You Want to Modify Balance'),
		)
		.addStringOption((option) =>
			option
				.setName('user_id')
				.setDescription('The User ID You Want to Modify Balance'),
		),
	async run({ client, interaction }) {
		const userId =
      interaction.options.getUser('user')?.id ??
      interaction.options.getString('user_id');
		if (!userId) {
			return await interaction.reply({
				content: 'Please provide either a user or a user ID.',
			});
		}

		const action = interaction.options.getString('action').toLowerCase();
		const amount = interaction.options.getNumber('amount');
		const balanceType = interaction.options.getString('transaction_type');

		if (!amount || amount <= 0) {
			return await interaction.reply({
				content: `${client.config.emojis.no} Please provide a valid amount.`,
			});
		}
		if (!['add', 'reduce', 'set'].includes(action)) {
			return await interaction.reply({
				content: `${client.config.emojis.no} Please provide a valid action (add, reduce, or set).`,
			});
		}

		await interaction.deferReply();
		try {
			const eco = require('../../Util/EconomyManager.js');
			let currentBalance = await eco.GetMoney({
				userID: userId,
				balance: balanceType,
			});

			if (action === 'reduce') currentBalance -= amount;
			else if (action === 'set') currentBalance = amount;
			else if (action === 'add') currentBalance += amount;

			await eco.SetMoney({
				userID: userId,
				balance: balanceType,
				amount: currentBalance,
			});
			const updatedBalance = await eco.GetMoney({
				userID: userId,
				balance: balanceType,
			});
			const formattedBalance = `${formatMoney(updatedBalance.raw)} ${emojis.money}`;

			const user = await client.users.fetch(userId);
			const title = `${action === 'add' ? 'Added' : action === 'reduce' ? 'Reduced' : 'Set'} ${formatMoney(amount)} Into ${balanceType.charAt(0).toUpperCase() + balanceType.slice(1)}`;

			const balanceEmbed = new EmbedBuilder()
				.setTitle(title)
				.setAuthor({
					name: user.tag,
					iconURL: user.displayAvatarURL({ dynamic: true }),
				})
				.addFields({
					name: `New ${balanceType.charAt(0).toUpperCase() + balanceType.slice(1)} Balance`,
					value: formattedBalance,
				})
				.setTimestamp();

			await interaction.editReply({ embeds: [balanceEmbed] });
		}
		catch (error) {
			console.error('Error modifying money:', error);
			await interaction.editReply(
				`${client.config.emojis.no} An error occurred while modifying money. \n` +
          error.message,
			);
		}
	},
	options: { devOnly: true },
};
