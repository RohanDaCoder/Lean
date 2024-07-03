const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction, client) => {
	try {
		const user = interaction.user;
		if (!interaction.commandName) return;

		const usageEmbed = new EmbedBuilder()
			.setTitle('Usage Logger')
			.setAuthor({
				name: user.tag || 'Unknown',
				iconURL: user.displayAvatarURL({ dynamic: true }),
			})
			.addFields(
				{ name: 'Name', value: user.tag || 'Unknown' },
				{ name: 'Guild', value: interaction.guild.name || 'Unknown' },
				{ name: 'Channel', value: interaction.channel.name || 'Unknown' },
				{ name: 'Command', value: interaction.commandName || 'Unknown' },
			)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor('Random');

		if (interaction.options.getSubcommand(false)) {
			usageEmbed.addFields({
				name: 'Sub-Command',
				value: interaction.options.getSubcommand(),
			});
		}

		// Ensure that the usageChannel is defined and send the embed
		if (process.usageChannel && process.usageChannel.send) {
			await process.usageChannel.send({ embeds: [usageEmbed] });
		}
		else {
			console.warn(
				'Usage channel is not defined or send method is not available.',
			);
		}
	}
	catch (error) {
		console.error('Error in usage logger:', error);
	}
};
