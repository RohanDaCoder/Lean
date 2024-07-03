const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildLogger = require('../../Util/GuildLogger');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a user from the server.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The user to kick')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('Reason for kicking the user')
				.setRequired(false),
		),

	run: async ({ interaction, client }) => {
		const target = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason') || 'No reason provided';

		if (!target) {
			return interaction.reply({
				content: `${client.config.emojis.no} User not found or invalid.`,
				ephemeral: true,
			});
		}

		if (!target.kickable) {
			return interaction.reply({
				content: `${client.config.emojis.no} I cannot kick this user.`,
				ephemeral: true,
			});
		}

		try {
			await interaction.deferReply({ ephemeral: true });

			const confirmButton = new ButtonBuilder()
				.setCustomId('confirm-kick')
				.setLabel('Confirm Kick')
				.setStyle(ButtonStyle.Danger);

			const cancelButton = new ButtonBuilder()
				.setCustomId('cancel-kick')
				.setLabel('Cancel')
				.setStyle(ButtonStyle.Secondary);

			const buttonRow = new ActionRowBuilder().addComponents(cancelButton, confirmButton);

			await interaction.followUp({
				content: `Are you sure you want to kick ${target.user.tag}?`,
				components: [buttonRow],
				ephemeral: true,
			});

			const buttonFilter = btn => ['confirm-kick', 'cancel-kick'].includes(btn.customId) && btn.user.id === interaction.user.id;
			const buttonCollector = interaction.channel.createMessageComponentCollector({ buttonFilter, time: 60000 });

			buttonCollector.on('collect', async btn => {
				if (btn.customId === 'confirm-kick') {
					try {
						await target.kick(reason);

						const kickEmbed = new EmbedBuilder()
							.setColor(0xff0000)
							.setTitle('User Kicked')
							.addFields(
								{ name: 'Kicked User', value: target.user.tag, inline: true },
								{ name: 'Kicked By', value: interaction.user.tag, inline: true },
								{ name: 'Reason', value: reason },
							)
							.setTimestamp()
							.setFooter({
								text: `User ID: ${target.id}`,
								iconURL: interaction.guild.iconURL(),
							});

						const guildLogger = new GuildLogger(interaction.guild.id);
						await guildLogger.log({
							message: `User ${target.user.tag} kicked by ${interaction.user.tag}. Reason: ${reason}`,
							user: interaction.user.tag,
							additionalInfo: `User ID: ${target.id}`,
						});

						await btn.update({ content: `${client.config.emojis.yes} User successfully kicked.`, embeds: [kickEmbed], components: [] });
					}
					catch (error) {
						console.error('Error kicking user:', error);
						await btn.update({
							content: `${client.config.emojis.no} An error occurred while kicking the user: ${error.message}`,
							components: [],
							ephemeral: true,
						});
					}
				}
				else if (btn.customId === 'cancel-kick') {
					await btn.update({
						content: `${client.config.emojis.no} Kick action has been canceled.`,
						components: [],
						ephemeral: true,
					});
				}
			});

			buttonCollector.on('end', collected => {
				if (collected.size === 0) {
					interaction.followUp({ content: 'No action was taken.', components: [] });
				}
			});

		}
		catch (error) {
			console.error('Error initiating kick process:', error);
			await interaction.reply({
				content: `${client.config.emojis.no} An error occurred while processing the kick command: ${error.message}`,
				ephemeral: true,
			});
		}
	},

	options: {
		devOnly: false,
		userPermissions: ['KickMembers'],
		botPermissions: ['KickMembers'],
	},
};