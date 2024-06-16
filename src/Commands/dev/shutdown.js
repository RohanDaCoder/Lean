const {
   SlashCommandBuilder
} = require('discord.js');
const discordTimestamp = require("../../Util/Timestamp");
module.exports = {
   data: new SlashCommandBuilder()
      .setName('shutdown')
      .setDescription("Shut Me Down."),

   async run({
      interaction, client
   }) {
      if (interaction.user.id === "922419431508938773") {
         await interaction.reply("Aight Bet, 🤫🧏");

         const relativeTimestamp = discordTimestamp(Date.now(), "R");
         const fullTimestamp = discordTimestamp(Date.now(), "f");
         await process.usageChannel.send(`Rohan Killed Me ${relativeTimestamp} Or ${fullTimestamp}`);
         process.exit(0);
      }
      await interaction.reply("Chill Man, I am not that bad.. :pleading_face:");
   }
};