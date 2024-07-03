const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('giveaway-resume')
	.setDescription('▶ Resume a paused giveaway')
	.addStringOption((option) =>
		option
			.setName('giveaway')
			.setDescription('The giveaway to resume (message ID or giveaway prize)')
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
				content: `${client.config.emojis.no} You need to have the manage messages permissions to pause giveaways.`,
				ephemeral: true,
			});
		}

		const query = interaction.options.getString('giveaway');

		// try to find the giveaway with prize alternatively with ID
		const giveaway =
      // Search with giveaway prize
      client.giveawaysManager.giveaways.find(
      	(g) => g.prize === query && g.guildId === interaction.guild.id,
      ) ||
      // Search with giveaway ID
      client.giveawaysManager.giveaways.find(
      	(g) => g.messageId === query && g.guildId === interaction.guild.id,
      );

		// If no giveaway was found
		if (!giveaway) {
			return interaction.reply({
				content:
          client.config.emojis.no +
          ' Unable to find a giveaway for `' +
          query +
          '`.',
				ephemeral: true,
			});
		}

		if (!giveaway.pauseOptions.isPaused) {
			return interaction.reply({
				content: `${client.config.emojis.no} **[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  is not paused!`,
				ephemeral: true,
			});
		}

		// Edit the giveaway
		client.giveawaysManager
			.unpause(giveaway.messageId)
		// Success message
			.then(() => {
				// Success message
				interaction.reply(
					`${client.config.emojis.yes} **[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** has been successfully resumed!`,
				);
			})
			.catch((e) => {
				interaction.reply({
					content: e,
					ephemeral: true,
				});
			});
	},
};
