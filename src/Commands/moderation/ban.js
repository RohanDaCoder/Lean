const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a user from the server.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The user to ban')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('Reason for banning the user')
				.setRequired(false),
		),

	async run({ interaction, client }) {
		const target = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason') || 'No reason provided';
		if (!target) {
			return interaction.reply({
				content: `${client.config.emojis.no} User not found or invalid.`,
				ephemeral: true,
			});
		}
		if (!target.bannable) {
			return interaction.reply({
				content: `${client.config.emojis.no} I cannot ban this user.`,
				ephemeral: true,
			});
		}

		// Confirmation buttons
		const confirmButton = new ButtonBuilder()
			.setCustomId('confirm-ban')
			.setLabel('Confirm Ban')
			.setStyle(ButtonStyle.Danger);

		const cancelButton = new ButtonBuilder()
			.setCustomId('cancel-ban')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(cancelButton, confirmButton);

		await interaction.reply({
			content: `Are you sure you want to ban ${target.user.tag}?`,
			components: [row],
			ephemeral: true,
		});

		const filter = i => i.customId === 'confirm-ban' || i.customId === 'cancel-ban';
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			if (i.customId === 'confirm-ban') {
				try {
					await target.ban({ reason: reason });

					const banEmbed = new EmbedBuilder()
						.setColor(0xff0000)
						.setTitle('User Banned')
						.addFields(
							{ name: 'Banned User', value: target.user.tag, inline: true },
							{ name: 'Banned By', value: interaction.user.tag, inline: true },
							{ name: 'Reason', value: reason },
						)
						.setTimestamp()
						.setFooter({
							text: `User ID: ${target.id}`,
							iconURL: interaction.guild.iconURL(),
						});

					await i.update({ content: `${client.config.emojis.yes} User successfully banned.`, embeds: [banEmbed], components: [] });
				}
				catch (error) {
					console.error('Error banning user:', error);
					await i.update({
						content: `${client.config.emojis.no} An error occurred while banning the user.`,
						components: [],
						ephemeral: true,
					});
				}
			}
			else if (i.customId === 'cancel-ban') {
				await i.update({
					content: `${client.config.emojis.no} Ban action has been canceled.`,
					components: [],
					ephemeral: true,
				});
			}
		});

		collector.on('end', collected => {
			if (collected.size === 0) {
				interaction.editReply({ content: 'No action was taken.', components: [] });
			}
		});
	},

	options: {
		devOnly: false,
		userPermissions: ['BanMembers'],
		botPermissions: ['BanMembers'],
	},
};