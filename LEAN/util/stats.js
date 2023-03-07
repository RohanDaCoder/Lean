module.exports = {
  run: async (req, res, client) => {
await res.send(`Servers: ${client.guilds.cache.size}`)
  }
}