module.exports = {
  data: {
    name: 'meme',
    description: 'Get a random meme from PopCat API.',
  },

  run: async ({ interaction, client }) => {
    const axios = require("axios");
    let res = await axios.get(`http://api.popcat.xyz/meme`);
    const memeEmbed = new client.discord.EmbedBuilder()
      .setTitle(res.data.title)
      .addFields({ name: '💬 Comments', value: `${res.data.comments}` }, { name: '⬆ Upvotes', value: `${res.data.upvotes}` })
      .setImage(res.data.image)
      .setURL(res.data.url)
      .setColor("RANDOM");
    await interaction.reply({ embeds: [memeEmbed] });
  },
};