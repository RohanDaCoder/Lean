const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const suggestionChoices = [
  { name: "Feature Request", value: "feature" },
  { name: "Bug Report", value: "bug" },
  { name: "Other", value: "other" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Create a suggestion for developers.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of suggestion.")
        .setRequired(true)
        .addChoices(suggestionChoices),
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Description of the suggestion.")
        .setRequired(true),
    ),
  run: async ({ client, interaction }) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      // Retrieve user input
      const suggestionType = interaction.options.getString("type");
      const suggestionDescription =
        interaction.options.getString("description");

      // Create a Discord timestamp for the suggestion date
      const timestamp = Math.round(new Date().getTime() / 1000);
      const createdAt = `<t:${timestamp}:R>`;

      // Construct and send the embed
      const embed = new EmbedBuilder()
        .setTitle("New Suggestion")
        .setDescription(suggestionDescription)
        .setColor("#3498db")
        .addFields(
          { name: "Type", value: suggestionType },
          { name: "Author", value: interaction.user.tag },
          { name: "Date", value: createdAt },
        )
        .setTimestamp();

      // Send the suggestion embed to the suggestions channel
      const suggestionsChannel = await client.channels.fetch(
        client.config.channels.suggestion,
      );
      await suggestionsChannel.send({ embeds: [embed] });

      await interaction.editReply({
        content: "Suggestion submitted successfully.",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error in suggest command:", error);
      await interaction.editReply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
