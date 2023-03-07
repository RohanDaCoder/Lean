module.exports = {
  name: "sudo",
  run: async (client, message, args) => {
     if(!message.guild.me.permissions.has("MANAGE_WEBHOOKS")) return message.reply(process.no + ' I dont Have Permissions To Create Webhook!')
    await message.channel.sendTyping();
    let user =
    message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!user) return message.reply(process.no + ' Please Mention Or Provide A Id Of A User!')
    let msg = args.slice(1).join(" ")
    if (!msg) return message.reply(process.no+' Please Specify A Message!');
 await message.delete();
    const webhook = await message.channel.createWebhook(user.displayName, {
      avatar: user.user.displayAvatarURL({
        dynamic: true
      }),
      channel: message.channel.id
    });
    await webhook.send(msg).then(async () => {
      await webhook.delete();
    });
  }
}; 