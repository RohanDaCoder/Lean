const path = require("path");
const Database = require("calm.db");
const { EmbedBuilder } = require("discord.js");

module.exports = async (member, client) => {
  await goodbyeUser(member, client);
};

async function goodbyeUser(member, client) {
  if (!member) {
    throw TypeError("No User Provided When goodbyeing User");
  }
  if (!client) {
    throw TypeError("No Client Provided When goodbyeing User");
  }
  const guildId = member.guild.id;
  const logger = await client.loggers.get(guildId);
  const filePath = path.join(
    __dirname,
    `../../Database/Guilds/${guildId}.json`,
  );

  const config = new Database(filePath);

  const welcomeChannelID = await config.get("welcomeChannel");
  if (!welcomeChannelID) {
    return;
  }

  try {
    const welcomeChannel = await client.channels.fetch(welcomeChannelID);
    if (!welcomeChannel) {
      if (logger) {
        await logger.warn({
          message: `Could Not Fetch Welcome Channel, Does It Still Exist?`,
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

    const embed = generateLeaveEmbed(
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
          message: `I Don't Have Enough Permission On The Welcome Channel Setuped.`,
          user: `Welcome Module`,
        });
      }
    }
  }
}

function generateLeaveEmbed(
  username,
  guildName,
  memberCount,
  avatarURL,
  backgroundURL,
) {
  const apiURL = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(backgroundURL)}&text1=${encodeURIComponent(username)}&text2=Goodbye!&text3=We+now+have+${memberCount}+members&avatar=${encodeURIComponent(avatarURL)}`;
  const embed = new EmbedBuilder()
    .setTitle("Goodbye!")
    .setDescription(`${username} has left the server.`)
    .setColor("#ff0000")
    .setImage(apiURL)
    .setTimestamp();
  return embed;
}
