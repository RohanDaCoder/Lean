const Database = require("calm.db");
const path = require("path");
const { Collection } = require("discord.js");
const GuildLogger = require("../../Util/GuildLogger");
module.exports = async (c, client) => {
  const loggersDB = new Database(
    path.join(__dirname, "../../Database/loggers.json"),
  );
  client.loggers = new Collection();
  const loggers = await loggersDB.toJSON();
  for (const guildId in loggers) {
    const logger = new GuildLogger(guildId);
    await client.loggers.set(guildId, logger);
  }
};
