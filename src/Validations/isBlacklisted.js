const config = require("../config");

module.exports = async ({ interaction, client }) => {
  if (!config.blacklistedUserIds) return false;

  if (config.blacklistedUserIds.includes(interaction.user.id)) {
    await interaction.reply({
      content: `${config.emojis.no} You have been blacklisted from using ${client.user.username}.`,
    });
    return true;
  }
  return false;
};
