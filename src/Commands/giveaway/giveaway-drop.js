const messages = process.config.giveaway;

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('giveaway-drop')
	.setDescription('Create a drop giveaway')
	.addIntegerOption((option) =>
		option
			.setName('winners')
			.setDescription('How many winners the giveaway should have')
			.setRequired(true),
	)
	.addStringOption((option) =>
		option
			.setName('prize')
			.setDescription('What the prize of the giveaway should be')
			.setRequired(true),
	)
	.addChannelOption((option) =>
		option
			.setName('channel')
			.setDescription('The channel to start the giveaway in')
			.setRequired(true),
	);

module.exports = {
	data,
	run: async ({ client, interaction }) => {
		// If the member doesn't have enough permissions
		if (
			!interaction.member.permissions.has('ManageMessages') &&
      !interaction.member.roles.cache.some((r) => r.name === 'Giveaways')
		) {
			return interaction.reply({
				content: `${client.config.emojis.no} You need to have the manage messages permissions to start giveaways.`,
				ephemeral: true,
			});
		}

		const giveawayChannel = interaction.options.getChannel('channel');
		const giveawayWinnerCount = interaction.options.getInteger('winners');
		const giveawayPrize = interaction.options.getString('prize');

		if (!giveawayChannel.isTextBased()) {
			return interaction.reply({
				content: `${client.config.emojis.no}  Please select a text channel!`,
				ephemeral: true,
			});
		}
		if (giveawayWinnerCount < 1) {
			return interaction.reply({
				content: `${client.config.emojis.no} Please select a valid winner count! greater or equal to one.`,
			});
		}

		// Start the giveaway
		client.giveawaysManager.start(giveawayChannel, {
			// The number of winners for this drop
			winnerCount: giveawayWinnerCount,
			// The prize of the giveaway
			prize: giveawayPrize,
			// Who hosts this giveaway
			hostedBy: client.config.hostedBy ? interaction.user : null,
			// specify drop
			isDrop: true,
			// Messages
			messages,
		});

		interaction.reply(
			`${client.config.emojis.yes} Giveaway started in ${giveawayChannel}!`,
		);
	},
};
