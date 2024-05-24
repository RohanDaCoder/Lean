const Discord = require("discord.js");
const config = require("../../config.js");
module.exports = async (interaction, client) => {
	const usageEmbed = new Discord.EmbedBuilder()
	.setTitle(`Usage Logger`)
	.setAuthor({
		user: interaction.user.tag,
		iconURL: interaction.user.defaultAvatarURL({ dynamic: true })
	})
	.addFields({
		name: "Name",
		value: interaction.user.tag
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
	.setThumbnail(interaction.user.defaultAvatarURL({ dynamic: true }))
	.setTimestamp()
    if(!config) return;
	const channel = await client.channels.fetch(client.config.usageLogChannel);
	channel.send({ embeds: [usageEmbed] });
};
