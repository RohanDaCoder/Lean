module.exports = {
  name: 'avatar',
  run: async (client, i, Discord) => {
    const user = i.options.get('user');
    const embed = new Discord.MessageEmbed()
    .setTitle(`${user.user.tag}`)
    .setColor('BLURPLE')
    .setImage(user.user.displayAvatarURL({
      dynamic: true
    }));
   await i.reply({
     embeds: [
       embed
       ]
   })
  }
}