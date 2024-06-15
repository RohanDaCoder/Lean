const path = require("path");
const Database = require("../../Util/Database");
const generateEmbed = require("../../Util/WelcomeUtil");

module.exports = async (member, client, handler) => {
  await welcomeUser(member, client);
};

async function welcomeUser(member, client) {
  if (!member) return console.error("No User Provided When Welcoming User");
  if (!client) return console.error("No Client Provided When Welcoming User");
  const guildId = member.guild.id;

  const filePath = path.join(
    __dirname,
    `../../Database/Guilds/${guildId}.json`,
  );

  const config = new Database(filePath);

  const welcomeChannelID = await config.get("welcomeChannel");
  if (!welcomeChannelID) return console.error("No Welcome Channel ID");

  try {
    const welcomeChannel = await client.channels.fetch(welcomeChannelID);
    if (!welcomeChannel)
      return console.error("Could Not Fetch Welcome Channel");

    const guild = await member.guild.fetch(guildId);
    const memberCount = guild.memberCount;
    const avatarURL = member.user.displayAvatarURL({
      extension: "png",
      dynamic: false,
    });

    const backgroundURL = "https://cdn.popcat.xyz/welcome-bg.png";

    const embed = generateEmbed(
      member.user.username,
      guild.name,
      memberCount,
      avatarURL,
      backgroundURL,
    );
    await welcomeChannel.send({ embeds: [embed] });
  } catch (err) {
    if (err.code === 50013) return;
    console.error(`Error In Welcome Event: ${err}`);
  }
}

module.exports.welcomeUser = welcomeUser;
