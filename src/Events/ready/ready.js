const { ActivityType } = require("discord.js");
module.exports = async (c, client) => {
  const colors = require("colors");
  // eslint-disable-next-line no-console
  console.log(colors.blue(`[Client] ${c.user.tag} Is Ready`));
  process.usageChannel = await client.channels.fetch(
    client.config.channels.usage,
  );
  client.user.setActivity(client.config.activity, {
    type: ActivityType.Watching,
  });
};
