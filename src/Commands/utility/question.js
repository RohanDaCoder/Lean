const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("question")
    .setDescription("Ask a question")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The Question You Want To Ask")
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to ask the question")
        .setRequired(false),
    ),

  run: async ({ client, interaction }) => {
    await interaction.deferReply({ ephemeral: true });
    const question = interaction.options.getString("question");
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    const questionEmbed = new EmbedBuilder()
      .setTitle("**question**")
      .setDescription(`**${interaction.user.username}** Asks: **${question}**`)
      .setColor("Random");

    await channel.send({ embeds: [questionEmbed] }).then((msg) => {
      msg.react(client.config.emojis.yes);
      msg.react(client.config.emojis.no);
    });
    await interaction.editReply({
      content: `${client.config.emojis.yes} Successfully asked question.`,
      ephemeral: true,
    });
  },

  options: {
    devOnly: false,
    userPermissions: ["ManageMessages"],
    botPermissions: ["UseExternalEmojis", "AddReactions"],
  },
};
