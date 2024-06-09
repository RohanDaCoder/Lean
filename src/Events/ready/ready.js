const { ActivityType } = require("discord.js");

module.exports = async (c, client, handler) => {
  const colors = require("colors");
  console.log(colors.blue(`[Client] ${c.user.tag} Is Ready`));
  process.usageChannel = await client.channels.fetch(
    client.config.channels.usage,
  );

  client.user.setActivity(client.config.activity, {
    type: ActivityType.Watching,
  });
};