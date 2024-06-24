const { updateAllGuildStats } = require("../../Util/ServerStatsUtils.js");
const Database = require("../../Util/Database");
const path = require("path");

module.exports = {
  data: {
    name: "statsupdate",
    description: "Developer-only command to update server stats counters.",
  },
  run: async ({ interaction, client, handler }) => {
    try {
      const msg = await interaction.deferReply();
      const { default: ms } = await import("pretty-ms");
      const before = Date.now();
      await updateAllGuildStats(interaction);
      const after = msg.createdAt;
      const time = ms(before - after);
      await msg.edit(`Done. Took ${time}`);
    } catch (err) {
      await msg.edit({
        content: `${client.config.emojis.no} An Error Occured. \n${err.message}`,
        ephemeral: true,
      });
      console.error(err);
    }
  },
  options: {
    devOnly: false,
  },
};
