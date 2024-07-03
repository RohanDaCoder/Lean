const Discord = require("discord.js");

const messages = process.config.giveaway;
const ms = require("ms");
const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("giveaway-start")
  .setDescription("🎉 Start a giveaway")
  .addStringOption((option) =>
    option
      .setName("duration")
      .setDescription(
        "How long the giveaway should last for. Example values: 1m, 1h, 1d",
      )
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("winners")
      .setDescription("How many winners the giveaway should have")
      .setMinValue(1)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("prize")
      .setDescription("What the prize of the giveaway should be")
      .setRequired(true),
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to start the giveaway in")
      .setRequired(true),
  )
  .addRoleOption((option) =>
    option
      .setName("bonusrole")
      .setDescription("Role which would receive bonus entries")
      .setRequired(false),
  )
  .addIntegerOption((option) =>
    option
      .setName("bonusamount")
      .setDescription("The amount of bonus entries the role will receive")
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("invite")
      .setDescription(
        "Invite of the server you want to add as giveaway joining requirement",
      )
      .setRequired(false),
  )
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("Role you want to add as giveaway joining requirement")
      .setRequired(false),
  );
module.exports = {
  data,
  run: async ({ client, interaction }) => {
    // If the member doesn't have enough permissions
    if (
      !interaction.member.permissions.has("ManageMessages") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content: `${client.config.emojis.no} You need to have the manage messages permissions to start giveaways.`,
        ephemeral: true,
      });
    }

    const giveawayChannel = interaction.options.getChannel("channel");
    const giveawayDuration = interaction.options.getString("duration");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");

    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: `${client.config.emojis.no} Please select a text channel!`,
        ephemeral: true,
      });
    }
    if (isNaN(ms(giveawayDuration))) {
      return interaction.reply({
        content: `${client.config.emojis.no} Please select a valid duration!`,
        ephemeral: true,
      });
    }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: `${client.config.emojis.no} Please select a valid winner count! greater or equal to one.`,
      });
    }

    const bonusRole = interaction.options.getRole("bonusrole");
    const bonusEntries = interaction.options.getInteger("bonusamount");
    let rolereq = interaction.options.getRole("role");
    let invite = interaction.options.getString("invite");

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `${client.config.emojis.no} You must specify how many bonus entries would ${bonusRole} recieve!`,
          ephemeral: true,
        });
      }
    }

    await interaction.deferReply({ ephemeral: true });
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite);
      let client_is_in_server = client.guilds.cache.get(invitex.guild.id);
      reqinvite = invitex;
      if (!client_is_in_server) {
        const gaEmbed = {
          author: {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          },
          title: "Server Check!",
          url: "https://youtube.com/c/ZaxReload",
          description:
            "Woah woah woah! I see a new server! are you sure I am in that? You need to invite me there to set that as a requirement! 😳",
          timestamp: new Date(),
          footer: {
            iconURL: client.user.displayAvatarURL(),
            text: "Server Check",
          },
        };
        return interaction.editReply({ embeds: [gaEmbed] });
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Only members having ${rolereq} are allowed to participate in this giveaway!`;
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Only members having ${rolereq} are allowed to participate in this giveaway!\n- Members are required to join [this server](${invite}) to participate in this giveaway!`;
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Members are required to join [this server](${invite}) to participate in this giveaway!`;
    }

    // start giveaway
    client.giveawaysManager.start(giveawayChannel, {
      // The giveaway duration
      duration: ms(giveawayDuration),
      // The giveaway prize
      prize: giveawayPrize,
      // The giveaway winner count
      winnerCount: parseInt(giveawayWinnerCount),
      // Hosted by
      hostedBy: client.config.hostedBy ? interaction.user : null,
      // BonusEntries If Provided
      bonusEntries: [
        {
          // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
          bonus: new Function(
            "member",
            `return member.roles.cache.some((r) => r.name === \'${bonusRole?.name}\') ? ${bonusEntries} : null`,
          ),
          cumulative: false,
        },
      ],
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      },
    });
    interaction.editReply({
      content: `${client.config.emojis.yes} Giveaway started in ${giveawayChannel}!`,
      ephemeral: true,
    });

    if (bonusRole) {
      let giveaway = new Discord.EmbedBuilder()
        .setAuthor({ name: `Bonus Entries Alert!` })
        .setDescription(
          `**${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!`,
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }
  },
};
