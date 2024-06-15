const { SlashCommandBuilder } = require("discord.js");
const { welcomeUser } = require("../../Events/guildMemberAdd/welcomer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Generates a welcome card for a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to generate the welcome card for")
        .setRequired(true),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    welcomeUser(user, client);
    await interaction.editReply("Done.");
  },
};
