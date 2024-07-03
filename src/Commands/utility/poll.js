const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	options: {
		userPermissions: ['SendPolls'],
		botPermissions: ['UseExternalEmojis', 'EmbedLinks', 'AddReactions'],
	},
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Creates a poll with up to 5 options.')
		.addStringOption((option) =>
			option
				.setName('question')
				.setDescription('The question for the poll')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('option1').setDescription('Option 1').setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('option2').setDescription('Option 2').setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('option3').setDescription('Option 3').setRequired(false),
		)
		.addStringOption((option) =>
			option.setName('option4').setDescription('Option 4').setRequired(false),
		)
		.addStringOption((option) =>
			option.setName('option5').setDescription('Option 5').setRequired(false),
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel to send the poll to')
				.setRequired(false),
		),

	async run({ interaction, client }) {
		try {
			await interaction.deferReply({ ephemeral: true });

			const question = interaction.options.getString('question');
			const options = [
				interaction.options.getString('option1'),
				interaction.options.getString('option2'),
				interaction.options.getString('option3'),
				interaction.options.getString('option4'),
				interaction.options.getString('option5'),
			].filter(Boolean); // Filter out any undefined options

			const channel =
        interaction.options.getChannel('channel') || interaction.channel;

			if (options.length < 2) {
				return interaction.editReply({
					content: `${client.config.emojis.no} You need to provide at least 2 options for the poll.`,
					ephemeral: true,
				});
			}

			// Create the poll description with the options
			const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
			const description = options
				.map((option, index) => `${reactions[index]} ${option}`)
				.join('\n');

			const embed = new EmbedBuilder()
				.setTitle(question)
				.setDescription(description)
				.setColor('Random')
				.setTimestamp();

			// Send the poll embed to the specified channel
			const pollMessage = await channel.send({ embeds: [embed] });

			// Add reactions for each option
			for (let i = 0; i < options.length; i++) {
				await pollMessage.react(reactions[i]);
			}

			await interaction.editReply({
				content: `${client.config.emojis.yes} Poll created successfully in ${channel}.`,
				ephemeral: true,
			});
		}
		catch (error) {
			console.error('Error creating poll:', error);
			await interaction.editReply({
				content: `${client.config.emojis.no} An error occurred while trying to create the poll. \n${error.message}`,
				ephemeral: true,
			});
		}
	},
};
