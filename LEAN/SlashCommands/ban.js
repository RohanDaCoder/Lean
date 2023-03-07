const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ban',
  run: async (client, i, options) => {
if(!i.member.permissions.has('BAN_MEMBERS')) return message.reply(`${process.no} You Dont Have Permission To Use This Command!`);

let target = options.getMentionable("target")
let reason = i.options.getString("reason") || 'No Reason Specifyed.';

target.ban().catch((err) => {
  message.reply(`${process.no} Something Went Wrong While Banning ${target.user.tag}`);
  console.log(err);
});

const banEmbed = new MessageEmbed()
.setTitle('Ban')
.setDescription(`${target} Successfully Banned ${target.user.tag}`)
.addField({
  name: 'Banned By',
  value: `${i.user.tag}`
})
.addField({
  name: 'Reason',
  value: `${reason}`
})
.setThumbnail(target.user.displayAvatarURL({
  dynamic: true
}))
.setColor('GREEN');
await message.reply({
  embeds: [
    banEmbed
    ]
});
    
  }
};