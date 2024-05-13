const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config.js");
const models = [
  {
    name: "Stable Diffusion (Default)",
    value:
      "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
  },
  {
    name: "Openjourney (Midjourney style)",
    value:
      "prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb",
  },
  {
    name: "Erlich",
    value:
      "laion-ai/erlich:92fa143ccefeed01534d5d6648bd47796ef06847a6bc55c0e5c5b6975f2dcdfb",
  },
  {
    name: "Mini DALL-E",
    value:
      "kuprel/min-dalle:2af375da21c5b824a84e1c459f45b69a117ec8649c2aa974112d7cf1840fc0ce",
  },
  {
    name: "Waifu Diffusion",
    value:
      "cjwbw/waifu-diffusion:25d2f75ecda0c0bed34c806b7b70319a53a1bccad3ade1a7496524f013f48983",
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Generate an image using a prompt.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Enter your prompt")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("model")
        .setDescription("The image model")
        .addChoices(models)
        .setRequired(false),
    ),
  run: async ({ interaction }) => {
    try {
      const prompt = interaction.options.getString("prompt");
      const model = interaction.options.getString("model") || models[0].value;

      await interaction.reply({
        content: `${emojis.loading} Imagining ${prompt}`,
      });

      const { default: Replicate } = await import("replicate");
      const { default: ms } = await import("pretty-ms");
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY,
      });

      const output = await replicate.run(model, {
        input: {
          prompt,
        },
      });

      const embed = new EmbedBuilder()
        .setTitle("Image Generated")
        .setDescription(`**Prompt:**\n${prompt}`)
        .setColor("#44a3e3")
        .setImage(output[0])
        .setFooter(
          { text: `Requested by ${interaction.user.username}` },
          interaction.user.displayAvatarURL({ dynamic: true }),
        );
      const tookTime = ms(Date.now() - interaction.createdTimestamp);
      await interaction.editReply({
        content: `Took ${tookTime}`,
        embeds: [embed],
      });
    } catch (error) {
      const errEmbed = {
        title: "An error occurred",
        description: `\`\`\`${error}\`\`\``,
        color: 0xe32424,
      };

      await interaction.editReply({
        content: "An error occurred",
        embeds: [errEmbed],
      });
      console.error(error);
    }
  },
  options: {
    cooldown: "1m",
  },
};
