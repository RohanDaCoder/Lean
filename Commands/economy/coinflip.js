const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin"),
  run: async ({ interaction }) => {
    try {
      const message = await interaction.reply("Flipping coin...");

      // Wait for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Randomly determine the outcome of the coin flip
      const isHeads = Math.random() < 0.5;

      // Edit the original message with the result
      if (isHeads) {
        await message.edit("It's heads!");
      } else {
        await message.edit("It's tails!");
      }
    } catch (error) {
      console.error("Error flipping coin:", error);
      await interaction.reply({
        content: "An error occurred while flipping the coin.",
        ephemeral: true,
      });
    }
  },
};
