const { updateAllGuildStats } = require("../../Util/ServerStatsUtils");
module.exports = async () => {
  await updateAllGuildStats();
};
