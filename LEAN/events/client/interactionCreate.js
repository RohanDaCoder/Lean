 module.exports = (client, users, Discord) => {
client.on('interactionCreate', async (i) => {
  const { commandName, options } = i;
  const command = client.scommand.get(commandName);
  if(!command) return;
  command.run(client, i, Discord);
})
 }