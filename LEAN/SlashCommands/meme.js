const Discord = require('discord.js')
exports.run = async (client, i, Discord) => {
const axios = require("axios")
  let res = await axios.get(`http://api.popcat.xyz/meme`);
const memeEmbed = new Discord.MessageEmbed()
.setTitle(res.data.title)
  .addFields({
    name: '💬 Comments',
    value: `${res.data.comments}`
  },
             {
               name: '⬆ Upvotes',
               value: `${res.data.upvotes}`
             })
.setImage(res.data.image)
.setURL(res.data.url)
.setColor("RANDOM")
await i.reply({embeds:[memeEmbed]});
  }
                                                                          

exports.name = "meme"

				
