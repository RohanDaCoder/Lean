module.exports = {
	data: {
		name: "log",
		description: "Log A Test Message In Your Server's Logger."
	},
	async run({ interaction, client }) {
		await interaction.reply({ content: `Sending.. `});
		const logger = await client.loggers.get(interaction.guild.id);
		if(!logger) return interaction.editReply(`Logger Doesnt Exist`);
		await logger.warn({
			message: `Test Message`,
			user: interaction.user.username,
			additionalInfo: `Yay`
		})
	}
}
