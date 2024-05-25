const {
   SlashCommandBuilder, EmbedBuilder
} = require("discord.js");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("serverlist")
      .setDescription(
      "Displays a list of servers the bot is in and detailed information about them.", ),
   options: {
      devOnly: true,
   },
   async run({
      interaction, client
   }) {
      try {
         await interaction.reply({
            content: `${client.user.tag} is in ${client.guilds.cache.size} servers`,
            ephemeral: true,
         });

         for (const guild of client.guilds.cache.values()) {
            const owner = await guild.fetchOwner();
            const inviteManager = guild.invites;
            const invites = await inviteManager.fetch();

            let inviteLink = "No Invite Available";

            if (invites.size > 0) {
               inviteLink = `[Server Invite Link](https://discord.gg/${invites.first().code})`;
            } else {
               try {
                  const newInvite = await inviteManager.create();
                  inviteLink = `[Server Invite Link](https://discord.gg/${newInvite.code})`;
               } catch (error) {
                  console.error("Error creating invite:", error);
               }
            }
            const createdAt = `${new Date(guild.createdTimestamp).toDateString()} (<t:${Math.round(guild.createdTimestamp / 1000)}:R>)`;
            console.log(guild.createdTimestamp);
            console.log(createdAt)
            const embed = new EmbedBuilder()
               .setTitle(`Server: ${guild.name}`)
               .setColor("#0099ff")
               .addFields({
               name: "ID",
               value: guild.id,
               inline: true
            }, {
               name: "Name",
               value: guild.name,
               inline: true
            }, {
               name: "Members",
               value: `${guild.memberCount}`,
               inline: true
            }, {
               name: "Owner",
               value: `[${owner.user.tag}](https://discordapp.com/users/${guild.ownerId}) (${guild.ownerId})`,
               inline: true,
            }, {
               name: "Region",
               value: `${guild.region || "Unknown"}`,
               inline: true
            }, {
               name: "Created At",
               value: createdAt,
               inline: true,
            }, {
               name: "Boost Level",
               value: `${guild.premiumTier}`,
               inline: true,
            }, {
               name: "Boost Count",
               value: `${guild.premiumSubscriptionCount}`,
               inline: true,
            }, {
               name: "Verification Level",
               value: `${guild.verificationLevel}`,
               inline: true,
            }, {
               name: "Channels",
               value: `${guild.channels.cache.size}`,
               inline: true,
            }, {
               name: "Roles",
               value: `${guild.roles.cache.size}`,
               inline: true
            }, {
               name: "Emojis",
               value: `${guild.emojis.cache.size}`,
               inline: true,
            }, {
               name: "Icon",
               value: guild.iconURL() ? `[Link](${guild.iconURL()})` : "No Icon",
               inline: false,
            }, {
               name: "Banner",
               value: guild.bannerURL() ? `[Link](${guild.bannerURL()})` : "No Banner",
               inline: false,
            }, {
               name: "Description",
               value: guild.description || "No description",
               inline: false,
            }, {
               name: "Partnered",
               value: guild.partnered ? "Yes" : "No",
               inline: true,
            }, {
               name: "Verified",
               value: guild.verified ? "Yes" : "No",
               inline: true,
            }, {
               name: "Invite Link",
               value: inviteLink,
               inline: true
            }, )
            .setTimestamp();

            await interaction.followUp({
               ephemeral: true,
               embeds: [embed]
            });
         }
      } catch (error) {
         console.error("Error in serverlist command:", error);
         if (error.code === "InteractionAlreadyReplied") return;
         await interaction.reply({
            content: "An error occurred while executing the command.",
            ephemeral: true,
         });
      }
   },
};