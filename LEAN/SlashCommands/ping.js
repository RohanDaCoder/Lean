module.exports = {
  name: "ping",
  run: async (client, i, options) => {
    i.reply({
      content: `${client.ws.ping}ms!`
    })
  }
}