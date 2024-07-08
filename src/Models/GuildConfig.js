const { Schema, model } = require("mongoose");

const guildConfigSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  welcomeChannel: {
    type: String,
    default: null,
  },
  serverStatsCategory: {
    type: String,
    default: null,
  },
  totalMembersChannel: {
    type: String,
    default: null,
  },
  totalHumanMembersChannel: {
    type: String,
    default: null,
  },
  totalBotsChannel: {
    type: String,
    default: null,
  },
});

module.exports = model("GuildConfig", guildConfigSchema);
