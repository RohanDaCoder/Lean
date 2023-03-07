
module.exports = {
  name: 'profile',
  description: 'Create A Economy Profile',
  run: async (client, message, args) => {
const jsondb = require('simple-json-db');
try {
  const file = require('../db/economy/profiles/'+ message.author.id + '.json');
if(file) return message.reply(`${process.no} You Already Have A Profile!`)
} catch (err) {
const password = Math.floor(Math.random() * 10000);
    
    const profile = new jsondb(`./db/economy/profiles/${message.author. id}.json`);
      await profile.set('name', message.author.tag)
   await profile.set('balance', 50);
  await  profile.set('bank', 0);
   await profile.set('country', 'us');
  await  profile.set('createdat', Date.now)
  await  profile.set('password', password)
client.profiles.set(message.author.id, profile);
      await message.reply(`${process.yes} Succesfully Created Your Economy Profile. \nYour Profile Password Will Be Sended To Your DMs. \nAsk \`RohanPlayZ#4585\` If You Did Not Got The Password.`);
      await message.author.send(`Your Economy Profile Password: \`${password}\``);
    }
} 
 }