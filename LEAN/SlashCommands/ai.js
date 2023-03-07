module.exports = {
  name: 'ai',
  description: 'Talk With An AI',
  run: async (client, i, Discord) => {
     const msg = i.options.getString('message');
    const axios = require("axios");
    const res = await axios.get(`http://api.brainshop.ai/get?bid=165755&key=ZGb2lzrZc9dChJ3l&uid=[${i.user.id}]&msg=[${msg}]`)
await i.reply(`${res.data.cnt}`)
  }
}