const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The Question You Want To Ask")
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to create the poll")
        .setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    const question = interaction.options.getString("question");
    const channel = interaction.options.getChannel("channel");
    interaction.reply({
      content: `:x: Successfully created poll.`,
      ephemeral: true,
    });

    const pollEmbed = new EmbedBuilder()
      .setTitle("**Poll**")
      .setDescription(`**${interaction.user.username}** Asks: **${question}**`)
      .setColor("Random");

    interaction.channel.send({ embeds: [pollEmbed] }).then((msg) => {
      msg.react("<a:pollYes:1006899660482416761>");
      msg.react("<a:pollNo:1006899793789997076>");
    });
  },

  options: {
    devOnly: false,
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS"],
    deleted: false,
  },
};
