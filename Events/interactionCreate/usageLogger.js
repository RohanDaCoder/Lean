const Discord = require("discord.js")
module.exports = async (interaction, client) => {
const user = interaction.user;
	const usageEmbed = new Discord.EmbedBuilder()
	.setTitle(`Usage Logger`)
	.setAuthor({
		name: user.tag,
		iconURL: user.displayAvatarURL({ dynamic: true })
	})
	.addFields({
		name: "Name",
		value: user.tag
	}, {
		name: "Guild",
		value: interaction.guild.name
	}, {
		name: "Channel",
		value: interaction.channel.name
	}, {
		name: "Command",
		value: interaction.commandName
	})
	.setThumbnail(user.displayAvatarURL({ dynamic: true }))
	.setTimestamp()
	.setColor("Random")

	await process.usageChannel.send({ embeds: [usageEmbed] });
};
