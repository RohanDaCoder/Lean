module.exports = async (client, message, args, db) => {
const verify = async (client, command) => {
if(command.economy !== false) {
const member = message.member;
const profile = await client.profiles.get(member.id);
if(profile !== 'Created') {
  message.reply(':x: You Dont Have A Economy Profile! \nCreate One By Using: ' + `**${client.prefix}createprofile**`);
} 
   }
  }
}