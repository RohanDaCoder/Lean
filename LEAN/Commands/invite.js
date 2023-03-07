module.exports = {
  name: 'invite',
  run: async (client, message, args) => {
const e = new process.Discord.MessageEmbed()
     .setTitle('Invite Me!') 
    .setDescription('**[Click To Invite](https://bit.ly/leanbot)**')
    .setThumbnail(client.user.displayAvatarURL({
      dynamic: true
    }))
.setColor("BLURPLE");
    await message.reply({
      embeds: [
        e
      ]
    });
  }
};