const ms = require('ms');
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('giveaway-edit')
	.setDescription('🎉 Edit a giveaway')
	.addStringOption((option) =>
		option
			.setName('giveaway')
			.setDescription('The giveaway to end (message ID)')
			.setRequired(true),
	)
	.addStringOption((option) =>
		option
			.setName('duration')
			.setDescription(
				'Setting time of mentioned giveaway. Eg. 1h sets the current giveaway to end after an hour!',
			)
			.setRequired(true),
	)
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
		const gid = interaction.options.getString('giveaway');
		const time = interaction.options.getString('duration');
		const winnersCount = interaction.options.getInteger('winners');
		const prize = interaction.options.getString('prize');
		let duration;
		if (time.startsWith('-')) {
			duration = -ms(time.substring(1));
		}
		else {
			duration = ms(time);
		}

		if (isNaN(duration)) {
			return interaction.reply({
				content: `${client.config.emojis.no} Please select a valid duration!`,
				ephemeral: true,
			});
		}
		await interaction.deferReply({
			ephemeral: true,
		});
		// Edit the giveaway
		try {
			await client.giveawaysManager.edit(gid, {
				newWinnerCount: winnersCount,
				newPrize: prize,
				addTime: time,
			});
		}
		catch (e) {
			return interaction.editReply({
				content: `${client.config.emojis.no} No giveaway found with the given message ID: \`${gid}\``,
				ephemeral: true,
			});
		}
		interaction.editReply({
			content: `${client.config.emojis.yes} This giveaway has now been edited!`,
			ephemeral: true,
		});
	},
};
