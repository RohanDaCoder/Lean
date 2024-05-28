const {
  SlashCommandBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const ButtonManager = require("../../Util/ButtonManager");

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
    const buttonManager = new ButtonManager();

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
      };

      commands.forEach((command) => {
        const category = command.category || "Uncategorized";
        if (categories[category]) {
          categories[category].push(command);
        } else {
          if (!categories["Uncategorized"]) categories["Uncategorized"] = [];
          categories["Uncategorized"].push(command);
        }
      });

      // Custom button labels
      const buttonNames = {
        fun: "🎉 Fun",
        utility: "🛠️ Utility",
        moderation: "🛡️ Moderation",
        economy: "💰 Economy",
        admin: "⚠️ Admin",
        Uncategorized: "Miscellaneous",
        dev: "🗿 Developer",
      };

      // Check if the user is a developer
      const isDev = devUserIds.includes(userId);

      const categoryNames = Object.keys(categories);
      categoryNames.forEach((category) => {
        // Check if the user has Administrator permission for Admin category
        if (
          category === "admin" &&
          !interaction.member.permissions.has("ADMINISTRATOR")
        )
          return;

        // Skip showing the dev category if the user is not a developer
        if (category === "dev" && !isDev) return;

        buttonManager.createButton({
          customId: `help_category_${category}`,
          label: buttonNames[category] || category, // Use custom name if available
          style: ButtonStyle.Secondary,
        });
      });

      const row = buttonManager.createActionRow();

      // Initial Embed
      const initialEmbed = new EmbedBuilder()
        .setTitle("Help Menu")
        .setDescription("Select a category to see the commands")
        .setColor("#0099ff");

      const initialReply = await interaction.reply({
        embeds: [initialEmbed],
        components: [row],
        ephemeral: true,
      });

      buttonManager.setupCollector({
        interaction,
        time: 120000,
        message: initialReply,
        onCollect: async (i) => {
          const category = i.customId.replace("help_category_", "");
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
            components: [row],
            ephemeral: true,
          });
        },
        onEnd: (collected) => {
          console.log(`Collected ${collected.size} interactions.`);
        },
      });
    } catch (error) {
      console.error("Error in help command:", error);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
