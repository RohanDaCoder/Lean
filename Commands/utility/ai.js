const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Talk With An Ai")
    .addStringOption((o) =>
      o
        .setName("message")
        .setDescription("The Message You Want To Send")
        .setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    const msg = interaction.options.getString("message");
    const axios = require("axios");
    const res = await axios.get(
      `http://api.brainshop.ai/get?bid=165755&key=ZGb2lzrZc9dChJ3l&uid=${interaction.user.id}&msg=${encodeURIComponent(msg)}`,
    );
    await interaction.reply(`${res.data.cnt}`);
  },
};
