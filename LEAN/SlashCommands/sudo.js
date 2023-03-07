module.exports = {
  name: "sudo",
  run: async (client, i, options) => {
     if(!i.guild.me.permissions.has("MANAGE_WEBHOOKS")) return i.reply({
       content: `${process.no} I dont Have Permissions To Create Webhook!`,
       epehemeral: true
     })
    await i.channel.sendTyping();
    let user = i.options.getMentionable('user')
;    let msg = i.options.getString('message');
    const webhook = await i.channel.createWebhook(user.displayName, {
      avatar: user.user.displayAvatarURL({
        dynamic: true
      }),
      channel: i.channel.id
    });
    await webhook.send(msg).then(async () => {
      await webhook.delete();
    });
  }
}; 