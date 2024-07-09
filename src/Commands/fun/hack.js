const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Hacks a user')
    .addUserOption(option => option.setName('target').setDescription('User to hack').setRequired(true)),
  
  async run({interaction}) {
    const target = interaction.options.getUser('target');

    const fakeHacks = [
      `Accessing ${target.username}'s email...`,
      `Retrieving ${target.username}'s password...`,
      `Hacking into ${target.username}'s bank account...`,
      `Stealing ${target.username}'s browser history...`,
      `Deleting ${target.username}'s social media accounts...`,
      `Sending virus to ${target.username}'s computer...`,
      `Transferring funds from ${target.username}'s bank account...`,
      `Leaking ${target.username}'s private photos...`,
      `Wiping ${target.username}'s hard drive...`,
      `Planting ransomware in ${target.username}'s system...`
    ];

    await interaction.reply(`🔍 Starting hack on ${target.username}...`);

    for (let i = 0; i < fakeHacks.length; i++) {
      setTimeout(() => {
        interaction.followUp(fakeHacks[i]);
      }, i * 3000);
    }

    setTimeout(async () => {
      await interaction.followUp(`${client.config.emojis.yes } Successfully hacked ${target.username}!!`);
    }, fakeHacks.length * 3000);
  }
};