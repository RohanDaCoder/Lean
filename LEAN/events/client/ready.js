const chalk = require('chalk');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = (client) => {
  client.once("ready", async () => {
    console.log(chalk.blue(`\n[Client] Logged On As ${client.user.tag}`));
    client.user.setActivity(`Slash Commands!`, { type: `LISTENING` });

    const commands = client.application.commands;
    const { STRING, NUMBER, MENTIONABLE } = Discord.Constants.ApplicationCommandOptionTypes;

    await commands.create({
      name: 'ping',
      description: 'Returns Bot Latency'
    });

    await commands.create({
      name: 'ai',
      description: 'Talk With A AI',
      options: [
        {
          name: 'message',
          description: 'The Message You Want To Send.',
          type: STRING,
          required: true
        }
      ]
    });

    await commands.create({
      name: 'sudo',
      description: 'Impersonate Someone',
      options: [
        {
          name: 'user',
          description: 'The person you want to impersonate',
          type: MENTIONABLE,
          required: true
        },
        {
          name: 'message',
          description: 'The message the person will say',
          type: STRING,
          required: true
        }
      ]
    });

    await commands.create({
      name: "ban",
      description: "Ban a user",
      options: [{
        name: "target",
        description: "The user you want to ban",
        required: true,
        type: MENTIONABLE,
      },
      {
        name: "reason",
        description: "The reason why you want to ban the user",
        required: true,
        type: STRING
      }]
    });

    await commands.create({
      name: "poll",
      description: "Create a poll",
      options: [
        {
          name: "question",
          description: "The question you want to ask through the poll",
          type: STRING,
          required: true
        }
      ]
    });

    await commands.create({
      name: 'support',
      description: 'Get the support server invite link'
    });

    await commands.create({
      name: "clear",
      description: "Purge/clear messages from this channel",
      options: [{
        name: "amount",
        description: "The amount of messages you want to delete",
        required: true,
        type: NUMBER
      }]
    });

    await commands.create({
      name: 'snake',
      description: 'Play snake'
    });

    await commands.create({
      name: 'meme',
      description: 'Get a meme'
    });
  });
};

