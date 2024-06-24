const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Temporarily mutes a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration of the mute (e.g., 10m, 1h, 1d)")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for muting the user")
        .setRequired(false),
    ),

  run: async ({ interaction }) => {
    const userToMute = interaction.options.getMember("user");
    const duration = interaction.options.getString("duration");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const milliseconds = ms(duration);

    if (!milliseconds) {
      return interaction.reply({
        content: `${client.config.emojis.no} Incorrect duration format.`,
        ephemeral: true,
      });
    }

    try {
      await userToMute.timeout(milliseconds, reason);
      const muteEmbed = new EmbedBuilder()
        .setColor(0xffa500)
        .setTitle("User Muted")
        .addFields(
          { name: "Muted User", value: userToMute.user.tag },
          { name: "Muted By", value: interaction.user.tag },
          { name: "Duration", value: duration },
          { name: "Reason", value: reason },
        )
        .setTimestamp();
      await interaction.reply({ embeds: [muteEmbed] });
    } catch (error) {
      await interaction.reply({
        content: `${client.config.emojis.no} An Error Occured While Kicking ${userToMute.user.tag} \n${error.message}`,
        ephemeral: true,
      });
    }
  },

  options: {
    userPermissions: ["MuteMembers"],
    botPermissions: ["MuteMembers"],
  },
};

function ms(duration) {
  const matches = duration.match(/(\d+)([smhd])/);
  if (!matches) return null;

  const [time, unit] = matches;
  const durations = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return time * durations[unit];
}
