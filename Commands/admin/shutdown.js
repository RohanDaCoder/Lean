module.exports = {
  data: {
    name: "shutdown",
    description: "Shutdown Me",
  },
  run: async ({ interaction, client, handler }) => {
  await interaction.reply("Bye World!");
  await process.exit(0);
  await interaction.channel.send("Shutdown Failed..");
  },
  options: { devOnly: true }
};
