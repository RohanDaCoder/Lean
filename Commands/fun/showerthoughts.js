const axios = require("axios");
module.exports = {
  data: {
    name: 'showerthoughts',
    description: 'Get a random shower thought.',
  },

  run: async ({ client, interaction, Discord }) => {
    await interaction.deferReply()
    let res = await axios.get(`https://api.popcat.xyz/showerthoughts`);

    const swEmbed = new Discord.EmbedBuilder()
      .setTitle("Shower Thoughts")
      .setDescription(res.data.result)
      .addFields({ name: `Author`, value: res.data.author }, { name: "Upvotes", value: res.data.upvotes });

    await interaction.editReply({ embeds: [swEmbed] });
  },
};