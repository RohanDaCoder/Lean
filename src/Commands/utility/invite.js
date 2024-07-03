const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Get the bot\'s invite link'),

	run: async ({ interaction, client }) => {
		const permissions = '1239568215286';
		const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot`;

		const button = new ButtonBuilder()
			.setLabel('Invite Link')
			.setURL(inviteLink)
			.setStyle(ButtonStyle.Link);
		const row = new ActionRowBuilder().addComponents(button);

		const inviteEmbed = new EmbedBuilder()
			.setTitle('Invite Me!')
			.setDescription(`Invite ${client.user.username} Using The Button Below`)
			.setColor('Random')
			.setTimestamp()
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.reply({
			ephemeral: true,
			embeds: [inviteEmbed],
			components: [row],
		});
	},
};
