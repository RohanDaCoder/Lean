const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getskin')
    .setDescription('Get the skin of a Minecraft Bedrock player.')
    .addStringOption(option => 
      option.setName('username')
      .setDescription('The Minecraft username of the player.')
      .setRequired(true)),
  async run({ interaction, client }) {
    try {
      const username = interaction.options.getString('username');
      await interaction.deferReply();

      console.log(`Fetching XUID for ${username}..`);
      const xuidResponse = await axios.get(`https://api.geysermc.org/v2/xbox/xuid/${username}`);
      const xuid = xuidResponse.data.xuid;
      if (!xuid) throw new Error(`Could not fetch the XUID for ${username}`);
      console.log(`Found XUID of ${username}: ${xuid}`);

      console.log("Fetching Skin Texture ID..");
      const skinResponse = await axios.get(`https://api.geysermc.org/v2/skin/${xuid}`);
      const skinTextureID = skinResponse.data.texture_id;
      if (!skinTextureID) throw new Error(`Skin Texture ID not found for ${username}`);
      console.log(`Found Skin Texture ID for ${username}: ${skinTextureID}`);

      console.log("Fetching Skin URL..");
      const skinUrl = `http://textures.minecraft.net/texture/${skinTextureID}`;

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(`${username}'s Skin`)
        .setImage(skinUrl)
        .build();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error.message);
      await interaction.editReply({
        content: `An error occurred: ${error.message}`,
        ephemeral: true
      });
    }
  }
};