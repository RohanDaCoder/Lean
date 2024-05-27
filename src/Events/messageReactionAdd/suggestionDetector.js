module.exports = async (reaction, user, client) => {
console.log("hi");
  // Check if the reaction is on a suggestion message
  const suggestionChannelId = client.config.channels.suggestion;
  if (reaction.message.channelId !== suggestionChannelId) return;

  // Check if the reactor is an admin
  const isAdmin = client.config.CommandKit.devUserIds.includes(user.id);

  // If it's not an admin, return
  if (!isAdmin) return;
  const approveEmoji = client.config.emojis.approve || "👍";
  const declineEmoji = client.config.emojis.decline || "👎";
  // Check if the reaction is an approve or decline
  const emoji = reaction.emoji.name;
  console.log(emoji);
  if (emoji !== (approveEmoji) && emoji !== (declineEmoji)) return;

  // Retrieve the suggestion ID from the message content
  const suggestionIdRegex = /Suggestion ID: (\w+)/;
  const suggestionIdMatch = reaction.message.content.match(suggestionIdRegex);
  if (!suggestionIdMatch) return;

  const suggestionId = suggestionIdMatch[1];

  // Retrieve the suggestion from the database
  const suggestion = suggestionsDB.get(suggestionId);
  if (!suggestion) return;

  // Update the status of the suggestion based on the reaction
  if (emoji === (client.config.emojis.approve || "👍")) {
    suggestion.status = "Approved";
  } else if (emoji === (client.config.emojis.decline || "👎")) {
    suggestion.status = "Declined";
  }

  // Update the suggestion in the database
  suggestionsDB.set(suggestionId, suggestion);
};