const path = require("path");
const Database = require("../../Util/Database");
const { EmbedBuilder } = require("discord.js");

module.exports = async (member, client, handler) => {
  await welcomeUser(member, client);
};

async function welcomeUser(member, client) {
  if (!member) return console.error("No User Provided When Welcoming User");
  if (!client) return console.error("No Client Provided When Welcoming User");
  const guildId = member.guild.id;
  const logger = await client.loggers.get(guildId);
  const filePath = path.join(
    __dirname,
    `../../Database/Guilds/${guildId}.json`,
  );

  const config = new Database(filePath);

  const welcomeChannelID = await config.get("welcomeChannel");
  if (!welcomeChannelID) return console.error("No Welcome Channel ID");

  try {
    const welcomeChannel = await client.channels.fetch(welcomeChannelID);
    if (!welcomeChannel) {
      if (logger) {
        await logger.warn({
          message: "Could Not Fetch Welcome Channel. Does It Still Exist?",
          user: `Welcome Module`,
        });
      }
      return;
    }
    const guild = await member.guild.fetch(guildId);
    const memberCount = guild.memberCount;
    const avatarURL = member.user.displayAvatarURL({
      extension: "png",
      dynamic: false,
    });

    const backgroundURL = "https://cdn.popcat.xyz/welcome-bg.png";

    const embed = generateWelcomeEmbed(
      member.user.username,
      guild.name,
      memberCount,
      avatarURL,
      backgroundURL,
    );
    await welcomeChannel.send({ embeds: [embed] });
  } catch (err) {
    if (err.code === 50013) {
      if (logger) {
        await logger.warn({
          message: `I Don't Have Enough Permissions On ${welcomeChannel} (Welcome Channel)`,
          user: `Welcome Module`,
        });
      }
      return;
    }
    console.error(`Error In Welcome Event: ${err}`);
  }
}

function generateWelcomeEmbed(
  username,
  guildName,
  memberCount,
  avatarURL,
  backgroundURL,
) {
  const memCount = encodeURIComponent("#" + memberCount);
  const apiURL = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(backgroundURL)}&text1=${encodeURIComponent(username)}&text2=Welcome+to+${encodeURIComponent(guildName)}!&text3=You+are+member+${memCount}&avatar=${encodeURIComponent(avatarURL)}`;

  const embed = new EmbedBuilder()
    .setTitle("Welcome!")
    .setDescription(`Welcome to ${guildName}, ${username}!`)
    .setColor("#00ff00")
    .setImage(apiURL)
    .setTimestamp();
  return embed;
}
