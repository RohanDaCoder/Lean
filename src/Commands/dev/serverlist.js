const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverlist")
    .setDescription("Displays info about servers the bot is in")
    .addBooleanOption((option) =>
      option
        .setName("generateinvites")
        .setDescription("Create invite links if none exist"),
    )
    .addStringOption((option) =>
      option
        .setName("specificguild")
        .setDescription("Show info about a specific guild")
        .addChoices(
          process.client.guilds.cache.map((guild) => ({
            name: guild.name,
            value: guild.id,
          })),
        ),
    ),
  options: {
    devOnly: true,
    botPermissions: ["EmbedLinks"],
  },
  async run({ interaction, client }) {
    try {
      const generateInvites =
        interaction.options.getBoolean("generateinvites") || false;
      const specificGuildId = interaction.options.getString("specificguild");

      await interaction.deferReply({ ephemeral: true });

      const embeds = [];
      const guilds = specificGuildId
        ? [client.guilds.cache.get(specificGuildId)]
        : client.guilds.cache.values();

      for (const guild of guilds) {
        if (!guild) {
          continue;
        }

        const owner = await guild.fetchOwner().catch((err) => {
          console.error(`Failed to fetch owner for guild ${guild.id}:`, err);
          return { user: { tag: "Unknown", id: "N/A" } };
        });

        const inviteManager = guild.invites;
        const invites = await inviteManager.fetch().catch((err) => {
          console.error(
            `${client.config.emojis.no} Failed to fetch invites for guild ${guild.id}:`,
            err,
          );
          return new Map();
        });

        let inviteLink = "No Invite Available";

        if (invites.size > 0) {
          inviteLink = `[Server Invite Link](https://discord.gg/${invites.first().code})`;
        } else if (generateInvites) {
          try {
            const textChannels = guild.channels.cache.filter(
              (channel) =>
                channel.isTextBased() &&
                channel
                  .permissionsFor(guild.members.me)
                  .has("CreateInstantInvite"),
            );

            const randomChannel = textChannels.random();
            if (randomChannel) {
              const newInvite = await inviteManager.create(randomChannel.id);
              inviteLink = `[Server Invite Link](https://discord.gg/${newInvite.code})`;
            } else {
              inviteLink = "No suitable channel for invite creation.";
            }
          } catch (error) {
            console.error("Error creating invite:", error);
          }
        }

        const createdAt = `${new Date(guild.createdTimestamp).toDateString()} (<t:${Math.round(guild.createdTimestamp / 1000)}:R>)`;

        const embed = new EmbedBuilder()
          .setTitle(`Server: ${guild.name}`)
          .setColor("#0099ff")
          .addFields(
            { name: "ID", value: guild.id, inline: true },
            { name: "Name", value: guild.name, inline: true },
            { name: "Members", value: `${guild.memberCount}`, inline: true },
            {
              name: "Owner",
              value: `[${owner.user.tag}](https://discordapp.com/users/${guild.ownerId}) (${guild.ownerId})`,
              inline: true,
            },
            {
              name: "Region",
              value: `${guild.region || "Unknown"}`,
              inline: true,
            },
            { name: "Created At", value: createdAt, inline: true },
            {
              name: "Boost Level",
              value: `${guild.premiumTier}`,
              inline: true,
            },
            {
              name: "Boost Count",
              value: `${guild.premiumSubscriptionCount}`,
              inline: true,
            },
            {
              name: "Verification Level",
              value: `${guild.verificationLevel}`,
              inline: true,
            },
            {
              name: "Channels",
              value: `${guild.channels.cache.size}`,
              inline: true,
            },
            { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
            {
              name: "Emojis",
              value: `${guild.emojis.cache.size}`,
              inline: true,
            },
            {
              name: "Icon",
              value: guild.iconURL() ? `[Link](${guild.iconURL()})` : "No Icon",
              inline: false,
            },
            {
              name: "Banner",
              value: guild.bannerURL()
                ? `[Link](${guild.bannerURL()})`
                : "No Banner",
              inline: false,
            },
            {
              name: "Description",
              value: guild.description || "No description",
              inline: false,
            },
            {
              name: "Partnered",
              value: guild.partnered ? "Yes" : "No",
              inline: true,
            },
            {
              name: "Verified",
              value: guild.verified ? "Yes" : "No",
              inline: true,
            },
            { name: "Invite Link", value: inviteLink, inline: true },
          )
          .setTimestamp();

        if (guild.iconURL()) {
          embed.setThumbnail(guild.iconURL());
        }

        embeds.push(embed);
      }

      await interaction.followUp({ ephemeral: true, embeds });
    } catch (error) {
      console.error("Error in serverlist command:", error);
      if (error.code !== "INTERACTION_ALREADY_REPLIED") {
        await interaction.followUp({
          content: `${client.config.emojis.no} An error occurred while executing the command.`,
          ephemeral: true,
        });
      }
    }
  },
};
