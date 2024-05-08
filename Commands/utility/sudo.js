const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sudo")
    .setDescription("Send a message as another user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "The user whose name and avatar will be used to send the message.",
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    await interaction.channel.sendTyping();
    const user = interaction.options.getUser("user");

    const msg = interaction.options.getString("message");
    const webhook = await interaction.channel.createWebhook(user.username, {
      avatar: user.displayAvatarURL({ dynamic: true }),
      channel: interaction.channel.id,
    });

    await webhook.send(msg).then(async () => {
      await webhook.delete();
    });
  },
  options: {
    botPermissions: ["ManageMembers", "ManageWebhooks"],
    botPermissions: ["ManageMembers", "ManageWebhooks"],
  },
};
