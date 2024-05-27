module.exports = async (c, client, handler) => {
  console.log(`${c.user.tag} is ready!`);
  process.usageChannel = await client.channels.fetch(
    client.config.channels.usage,
  );
};
