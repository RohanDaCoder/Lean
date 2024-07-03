const {
	SlashCommandBuilder,
	WebhookClient,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sudo')
		.setDescription('Impersonates a user and sends a message.')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The user to impersonate')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('The message to send')
				.setRequired(true),
		),

	run: async ({ interaction, client }) => {
		const userToImpersonate = interaction.options.getUser('user');
		const message = interaction.options.getString('message');

		// Create a webhook in the channel and send a message using the webhook
		const webhook = await interaction.channel.createWebhook({
			name: userToImpersonate.username,
			avatar: userToImpersonate.displayAvatarURL(),
		});

		try {
			// Use the webhook to send the message using the impersonated user's details
			await webhook.send(message).then(() => {
				// Delete the webhook after sending the message to prevent abuse
				webhook.delete();
			});

			// Inform command issuer that the message has been sent
			const confirmEmbed = new EmbedBuilder()
				.setDescription(
					`${client.config.emojis.yes} Message sent as ${userToImpersonate.tag}`,
				)
				.setColor(0x00ae86);

			await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
		}
		catch (error) {
			// Delete the webhook if an error occurs
			webhook.delete();
			console.error(error);
			await interaction.reply({
				content: `${client.config.emojis.no} Failed to send the message. \n${error.message}`,
				ephemeral: true,
			});
		}
	},

	options: {
		userPermissions: ['ManageMessages'],
		botPermissions: ['ManageWebhooks', 'ManageMessages'],
	},
};
