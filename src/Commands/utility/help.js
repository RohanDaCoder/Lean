const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(
      "Displays a list of commands categorized by their function.",
    ),
  async run({ interaction, client }) {
    try {
      const commandDir = path.resolve(__dirname, "../../Commands");
      const categories = {
        fun: [],
        utility: [],
        moderation: [],
        economy: [],
        dev: [],
        admin: [],
        giveaway: [],
        image: [],
        extra: [],
        games: [],
      };

      const getCommands = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
          const filePath = path.join(dir, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            getCommands(filePath);
          } else if (file.endsWith(".js")) {
            const command = require(filePath);
            if (command.data && command.data.name && command.data.description) {
              const category = path.basename(dir);
              if (categories[category]) {
                categories[category].push(command);
              }
            }
          }
        });
      };

      getCommands(commandDir);

      const buttonNames = {
        fun: "🎉 Fun",
        utility: "🛠️ Utility",
        moderation: "🛡️ Moderation",
        economy: "💰 Economy",
        admin: "⚠️ Admin",
        dev: "🗿 Developer",
        giveaway: "🎁 Giveaway",
        image: "📷 Image Manipulation",
        extra: "📭 Extra",
        games: "🎮 Games",
      };

      const categoryNames = Object.keys(categories);
      const selectOptions = [];

      for (const category of categoryNames) {
        const label = buttonNames[category] || category;
        const value = category;

        selectOptions.push(
          new StringSelectMenuOptionBuilder().setLabel(label).setValue(value),
        );
      }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("help_select_menu")
        .setPlaceholder("Select a category")
        .addOptions(selectOptions);

      const initialEmbed = new EmbedBuilder()
        .setTitle("Help Menu")
        .setDescription("Select a category to see the commands")
        .setColor("#0099ff");

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        embeds: [initialEmbed],
        components: [row],
        ephemeral: false,
      });

      const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) =>
          i.customId === "help_select_menu" &&
          i.user.id === interaction.user.id,
      });

      collector.on("collect", async (i) => {
        const category = i.values[0];
        const categoryCommands = categories[category];
        await i.deferUpdate();
        const embed = new EmbedBuilder()
          .setTitle(`Commands in ${category} category`)
          .setDescription(
            categoryCommands
              .map((cmd) => `**/${cmd.data.name}** - ${cmd.data.description}`)
              .join("\n"),
          )
          .setColor("#0099ff");

        await i.editReply({
          embeds: [embed],
          ephemeral: false,
        });
      });
    } catch (error) {
      console.error("Error in help command:", error);
      await interaction.reply({
        content: `${client.config.emojis.no} An error occurred while executing the command. \n${error.message}`,
        ephemeral: false,
      });
    }
  },
  options: {
    botPermissions: ["EmbedLinks"],
  },
};
