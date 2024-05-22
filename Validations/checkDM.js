module.exports = async ({ interaction }) => {
  if (interaction.inGuild() === false) {
    await interaction.reply({
      content: ":x: Please Use My Commands In A Server And Not In a DM!",
    });
    return true;
  }
};
