const { updateAllGuildStats } = require("../../Util/ServerStatsUtils");
module.exports = async (member, client, handler) => {
  await updateAllGuildStats();
};
