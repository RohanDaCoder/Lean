const { EmbedBuilder } = require("discord.js");

function generateWelcomeEmbed(
  username,
  guildName,
  memberCount,
  avatarURL,
  backgroundURL,
) {
  const memCount = encodeURIComponent("#" + memberCount);
  const apiURL = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(backgroundURL)}&text1=${encodeURIComponent(username)}&text2=Welcome+to+${encodeURIComponent(guildName)}!&text3=You+are+member+${memCount}&avatar=${encodeURIComponent(avatarURL)}`;
  console.log(apiURL);
  const embed = new EmbedBuilder()
    .setTitle("Welcome!")
    .setDescription(`Welcome to ${guildName}, ${username}!`)
    .setColor("#00ff00")
    .setImage(apiURL)
    .setTimestamp();
  return embed;
}

module.exports = generateWelcomeEmbed;
