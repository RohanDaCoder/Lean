module.exports = {
  data: {
    name: 'ai',
    description: 'Talk with an AI.',
  },

  run: async ({ client, interaction }) => {
    const msg = interaction.options.getString('message');
    const axios = require("axios");
    const res = await axios.get(`http://api.brainshop.ai/get?bid=165755&key=ZGb2lzrZc9dChJ3l&uid=${interaction.user.id}&msg=${encodeURIComponent(msg)}`);
    await interaction.reply(`${res.data.cnt}`);
  },
};