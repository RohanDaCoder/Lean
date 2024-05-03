module.exports = {
  data: {
    name: "sudo",
    description: "Send a message as another user.",
  },

  run: async ({ client, interaction }) => {
    const { Permissions } = require('discord.js');

    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
      return interaction.reply({
        content: `:x: I don't have permissions to create a webhook!`,
        ephemeral: true
      });
    }

    await interaction.channel.sendTyping();
    let user = interaction.options.getMentionable('user');
    let msg = interaction.options.getString('message');
    const webhook = await interaction.channel.createWebhook(user.displayName, {
      avatar: user.user.displayAvatarURL({ dynamic: true }),
      channel: interaction.channel.id
    });

    await webhook.send(msg).then(async () => {
      await webhook.delete();
    });
  },
};