const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const formatTimestamp = require("../../Util/Timestamp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription(
      "Fetch a user by mention or ID and display their information.",
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to fetch")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The user ID to fetch")
        .setRequired(false),
    ),

  async run({ interaction, client }) {
    await interaction.deferReply();

    const userOption = interaction.options.getUser("user");
    const userIdOption = interaction.options.getString("user_id");

    if (!userOption && !userIdOption) {
      return interaction.editReply(
        `${client.config.emojis.no} Please provide either a user mention or a user ID.`,
      );
    }

    let user;
    if (userOption) {
      user = await client.users.fetch(userOption.id);
    } else if (userIdOption) {
      user = await client.users.fetch(userIdOption);
    }

    if (user) {
      const createdAtTimestamp = user.createdTimestamp || "Unknown";
      const createdAtFormatted =
        createdAtTimestamp !== "Unknown"
          ? `${new Date(createdAtTimestamp).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} (${formatTimestamp(createdAtTimestamp, "R")})`
          : "Unknown";

      const userEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`User Information`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
                  { name: "Tag", value: user.tag || "Unknown", inline: true },
          { name: "Username", value: user.username || "Unknown", inline: true },
          {
            name: "Discriminator",
            value: user.discriminator || "Unknown",
            inline: true,
          },
          { name: "ID", value: user.id || "Unknown", inline: true },
          { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
          { name: "Created At", value: createdAtFormatted, inline: true },
          {
            name: "Global Name",
            value: user.globalName || "Unknown",
            inline: true,
          },
          {
            name: "Accent Color",
            value: user.hexAccentColor || "Unknown",
            inline: true,
          },
          {
            name: "Banner",
            value: user.banner ? `[Link](${user.bannerURL()})` : "Unknown",
            inline: true,
          },
          {
            name: "Avatar URL",
            value: `[Link](${user.avatarURL()})` || "Unknown",
            inline: true,
          },
        )
        .setFooter({ text: `Requested By ${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
        .setTimestamp();

      await interaction.editReply({ embeds: [userEmbed] });
    } else {
      await interaction.editReply(`${client.config.emojis.no} User not found.`);
      return;
    }
  },
};
