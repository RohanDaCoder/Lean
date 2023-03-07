const Discord = require('discord.js')
exports.run = (client, i, options) => {
if(!i.member.permissions.has('MANAGE_SERVER')) return i.reply(`${process.no} **You Dont Have Permission To Create A Poll!**`);
 const sentence = i.options.getString("question");

i.reply({
  content: `${process.no} Successfully Created Poll.`,
        ephemeral: true
});
  
const pollEmbed = new Discord.MessageEmbed()
.setTitle('**Poll**')
.setDescription(`**${i.user.username}** Asks: **${sentence}**`)
.setColor('BLURPLE')
i.channel.send({embeds:[pollEmbed]})
 .then(msg => {
   msg.react("<a:pollYes:1006899660482416761>")
   msg.react("<a:pollNo:1006899793789997076>")
 })
}

exports.name = "poll"