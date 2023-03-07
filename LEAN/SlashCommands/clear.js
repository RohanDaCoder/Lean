module.exports = {
  name: 'clear',
  description: 'Clear Messages',
  run: async (client, i, options) => {
const amount = i.options.getNumber("amount")
    
  await i.channel.bulkDelete(amount).catch(async (err) => {
    await i.reply({
      content: `${process.no} Something Went Wrong`
    });
    return;
  }).then(async () => {
    await i.channel.send(`${i.user.tag} Deleted \`${amount}\` Messages`);
  })
  }
};