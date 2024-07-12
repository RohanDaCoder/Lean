const config = require("../config");

module.exports = async ({ interaction }) => {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: `${config.emojis.no} My commands can only be used in a server.`,
    });
    return true;
  }
  return false;
};
