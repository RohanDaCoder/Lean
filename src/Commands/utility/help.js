const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(
      "Displays a list of commands categorized by their function.",
    ),
  options: {
    devOnly: false,
  },
  async run({ interaction, client, handler }) {
    try {
      const commands = handler.commands;
      const devUserIds = handler.devUserIds;
      const userId = interaction.user.id;

      // Categorize commands
      const categories = {
        fun: [],
        utility: [],
        moderation: [],
        economy: [],
        dev: [],
        admin: [],
        giveaway: [],
      };

      for (const command in commands) {
        const category = commands[command].category || "Uncategorized";
        if (categories[category]) {
          categories[category].push(commands[command]);
        } else {
          if (!categories["Uncategorized"]) categories["Uncategorized"] = [];
          categories["Uncategorized"].push(commands[command]);
        }
      }

      // Custom button labels
      const buttonNames = {
        fun: "🎉 Fun",
        utility: "🛠️ Utility",
        moderation: "🛡️ Moderation",
        economy: "💰 Economy",
        admin: "⚠️ Admin",
        Uncategorized: "Miscellaneous",
        dev: "🗿 Developer",
        giveaway: "🎁 Giveaway",
      };

      // Check if the user is a developer
      const isDev = devUserIds.includes(userId);

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

      // Initial Embed
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

      // Interaction collector for the select menu
      const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) =>
          i.customId === "help_select_menu" &&
          i.user.id === interaction.user.id,
        time: 120000,
      });

      collector.on("collect", async (i) => {
        const category = i.values[0];
        const categoryCommands = categories[category];

        const embed = new EmbedBuilder()
          .setTitle(`Commands in ${category} category`)
          .setDescription(
            categoryCommands
              .map((cmd) => `**/${cmd.data.name}** - ${cmd.data.description}`)
              .join("\n"),
          )
          .setColor("#0099ff");

        await i.update({
          embeds: [embed],
          ephemeral: false,
        });
      });

      collector.on("end", (collected) => {
        console.log(`Collected ${collected.size} interactions.`);
      });
    } catch (error) {
      console.error("Error in help command:", error);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: false,
      });
    }
  },
};
