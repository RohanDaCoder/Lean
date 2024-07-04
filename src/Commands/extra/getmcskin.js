const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  options: {
    botPermissions: ["EmbedLinks"],
  },
  data: new SlashCommandBuilder()
    .setName("getskin")
    .setDescription("Get the skin of a Minecraft player.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The Minecraft username of the player.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("version")
        .setDescription("The version of Minecraft (bedrock or java).")
        .setRequired(true)
        .addChoices(
          { name: "Bedrock", value: "bedrock" },
          { name: "Java", value: "java" },
        ),
    ),

  async run({ interaction, client }) {
    try {
      const username = interaction.options.getString("username");
      const version = interaction.options.getString("version");
      await interaction.deferReply();

      let skinUrl;
      if (version === "bedrock") {
        skinUrl = await getBedrockSkinUrl(username, client, interaction);
      } else if (version === "java") {
        skinUrl = await getJavaSkinUrl(username, client, interaction);
      } else {
        return interaction.editReply(
          `${client.config.emojis.no} Invalid version specified.`,
        );
      }

      const embed = createSkinEmbed(username, skinUrl);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.followUp({
        content: `${client.config.emojis.no} An error occurred: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};

async function getBedrockSkinUrl(username, client, interaction) {
  const xuidResponse = await axios.get(
    `https://api.geysermc.org/v2/xbox/xuid/${username}`,
  );
  const xuid = xuidResponse.data.xuid;
  if (!xuid)
    {return interaction.editReply(
      `${client.config.emojis.no} Could not fetch the XUID for ${username}`,
    );}

  const skinResponse = await axios.get(
    `https://api.geysermc.org/v2/skin/${xuid}`,
  );
  const skinTextureID = skinResponse.data.texture_id;
  if (!skinTextureID)
    {return interaction.editReply(
      `${client.config.emojis.no} Skin Texture ID not found for ${username}`,
    );}

  return `http://textures.minecraft.net/texture/${skinTextureID}`;
}

async function getJavaSkinUrl(username, client, interaction) {
  const uuidResponse = await axios.get(
    `https://api.mojang.com/users/profiles/minecraft/${username}`,
  );
  const uuid = uuidResponse.data.id;
  if (!uuid)
    {return interaction.editReply(
      `${client.config.emojis.no} Could not fetch the UUID for ${username}`,
    );}

  const profileResponse = await axios.get(
    `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`,
  );
  const properties = profileResponse.data.properties;
  const texturesProperty = properties.find((prop) => prop.name === "textures");
  if (!texturesProperty)
    {return interaction.editReply(
      `${client.config.emojis.no} Could not fetch textures for UUID ${uuid}`,
    );}

  const textureData = JSON.parse(
    Buffer.from(texturesProperty.value, "base64").toString(),
  );
  return textureData.textures.SKIN.url;
}

function createSkinEmbed(username, skinUrl) {
  return new EmbedBuilder()
    .setColor("#00FF00")
    .setTitle(`${username}'s Skin`)
    .setImage(skinUrl);
}
