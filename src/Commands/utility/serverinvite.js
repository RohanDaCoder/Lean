const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Get the invite link to the bot\'s official server'),

	run: async ({ interaction, client }) => {
		const officialServerLink = 'https://discord.com/invite/vCpBebaP8w';
		const button = new ButtonBuilder()
			.setLabel('Invite Link')
			.setURL(officialServerLink)
			.setStyle(ButtonStyle.Link);
		const row = new ActionRowBuilder().addComponents(button);
		const serverEmbed = new EmbedBuilder()
			.setTitle('Join My Official Server!')
			.setDescription('Join The Discord Server From The Button Below')
			.setColor('Random')
			.setTimestamp()
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.deferReply({ ephemeral: true });

		await interaction.editReply({
			embeds: [serverEmbed],
			components: [row],
			ephemeral: true,
		});
	},
};
