const axios = require("axios");
module.exports = {
  data: {
    name: 'meme',
    description: 'Get a random meme from PopCat API.',
  },

  run: async ({ interaction, client }) => {
    try {
      await interaction.deferReply();
      let res = await axios.get(`http://api.popcat.xyz/meme`)
      const memeEmbed = new client.discord.EmbedBuilder()
        .setTitle(res.data.title)
        .addFields({ name: '💬 Comments', value: `${res.data.comments}` }, { name: '⬆ Upvotes', value: `${res.data.upvotes}` })
        .setImage(res.data.image)
        .setURL(res.data.url)
        .setColor("RANDOM");
      await interaction.editReply({ embeds: [memeEmbed] });
    } catch (e) {
      await interaction.channel.send({
        content: `Error While Fetching A Meme. \nError: ${e.message}`
      });
    }
  },
};