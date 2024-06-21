const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mcserver")
    .setDescription("Fetch information about a Minecraft server.")
    .addStringOption(option => 
      option.setName("version")
        .setDescription("The version of the Minecraft server (Java or Bedrock).")
        .setRequired(true)
        .addChoices(
          { name: 'Java', value: 'java' },
          { name: 'Bedrock', value: 'bedrock' }
        )
    )
    .addStringOption(option => 
      option.setName("address")
        .setDescription("The address of the Minecraft server.")
        .setRequired(true)
    )
    .addIntegerOption(option => 
      option.setName("port")
        .setDescription("The port of the Minecraft server (optional).")
        .setRequired(false)
    ),

  run: async ({ interaction }) => {
    const version = interaction.options.getString("version");
    const address = interaction.options.getString("address");
    let port = interaction.options.getInteger("port");

    // Set default ports if not provided
    if (!port) {
      port = version === 'java' ? 25565 : 19132;
    }

    const apiUrl = version === 'java'
      ? `https://api.mcsrvstat.us/3/${address}:${port}`
      : `https://api.mcsrvstat.us/bedrock/3/${address}:${port}`;

    await interaction.deferReply();

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.online) {
        await interaction.editReply({ content: "The server is currently offline or unreachable.", ephemeral: true });
        return;
      }

      let imageAttachment = null;
      let imageUrl = null;
      if (data.icon) {
        const imagePath = path.join(__dirname, "../../Cache/serverimage.png");
        const base64Data = data.icon.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(imagePath, base64Data, 'base64');
        imageAttachment = new AttachmentBuilder(imagePath);
        imageUrl = `attachment://${path.basename(imagePath)}`;
      }

      const embed = new EmbedBuilder()
        .setTitle(data.hostname || address)
        .setDescription(data.motd?.clean?.join("\n") || "No MOTD available")
        .setColor("Blurple")
        .addFields(
          { name: "IP", value: data.ip, inline: true },
          { name: "Port", value: data.port.toString(), inline: true },
          { name: "Version", value: data.version || "Unknown", inline: true },
          { name: "Players", value: `${data.players.online} / ${data.players.max}`, inline: true }
        )
        .setTimestamp();

      if (imageUrl) {
        embed.setImage(imageUrl);
      }

      await interaction.editReply({ embeds: [embed], files: imageAttachment ? [imageAttachment] : [] });

    } catch (error) {
      console.error("Error fetching Minecraft server info:", error);
      await interaction.editReply({
        content: "An error occurred while trying to fetch the server information.",
        ephemeral: true
      });
    }
  },
};