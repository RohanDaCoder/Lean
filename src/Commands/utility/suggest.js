const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const path = require("path");
const Database = require("../../Util/Database");
const crypto = require("crypto");

// Path to the suggestions database
const suggestionsDBPath = path.join(__dirname, "../../Database/suggestions.json");

// Initialize the database
const suggestionsDB = new Database(suggestionsDBPath);

const suggestionChoices = [
  { name: "Feature Request", value: "feature" },
  { name: "Bug Report", value: "bug" },
  { name: "Other", value: "other" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Create a suggestion for developers.")
    .addStringOption(option => 
      option.setName("type")
        .setDescription("Type of suggestion.")
        .setRequired(true)
        .addChoices(suggestionChoices)
    )
    .addStringOption(option => 
      option.setName("description")
        .setDescription("Description of the suggestion.")
        .setRequired(true)
    ),
  async run({ interaction, client }) {
    try {
      // Retrieve user input
      const suggestionType = interaction.options.getString("type");
      const suggestionDescription = interaction.options.getString("description");

      // Generate a random suggestion ID using crypto
      const suggestionId = crypto.randomBytes(16).toString("hex");

      // Construct suggestion object
      const suggestion = {
        id: suggestionId,
        type: suggestionType,
        description: suggestionDescription,
        status: "Pending",
        author: interaction.user.tag,
        timestamp: new Date().toISOString()
      };

      // Save the suggestion to the database
      suggestionsDB.set(suggestionId, suggestion);

      // Construct and send the embed
      const embed = new EmbedBuilder()
        .setTitle("New Suggestion")
        .setDescription("A new suggestion has been submitted.")
        .setColor("#0099ff")
        .addFields(
          { name: "Description", value: suggestionDescription },
          { name: "Type", value: suggestionType, inline: true },
          { name: "Status", value: suggestion.status, inline: true },
          { name: "Author", value: suggestion.author, inline: true },
          { name: "Timestamp", value: suggestion.timestamp, inline: true }
        )
        .setTimestamp();

      // Send the suggestion embed to the suggestions channel
      const suggestionsChannel = await client.channels.fetch(client.config.channels.suggestion);
      const message = await suggestionsChannel.send({ embeds: [embed] });

      // React with approve and decline emojis from client.config
      const approveEmoji = client.config.emojis.approve || "👍";
      const declineEmoji = client.config.emojis.decline || "👎";
      await message.react(approveEmoji);
      await message.react(declineEmoji);

      await interaction.reply({ content: "Suggestion submitted successfully.", ephemeral: true });
    } catch (error) {
      console.error("Error in suggest command:", error);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};