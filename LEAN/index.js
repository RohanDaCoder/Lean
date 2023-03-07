const chalk = require('chalk');
const { prefix } = require('./config.js');
const thum = require('thum.io');


process.no = "<a:pollNo:1006899793789997076>"
process.yes = "<a:pollYes:1006899660482416761>"

const Discord = require("discord.js");
const { MessageEmbed, GatewayIntentBits, Partials } = require('discord.js');


const client = new Discord.Client({
    ws : {
        properties: {
            $browser: "Discord iOS",
        }
    },
    intents:  [
      37431
    ]
});


const db = new Discord.Client(global.client = {
    intents:  [
      37431
    ]
});
 

client.Discord = Discord;
const Jsondb = require('simple-json-db');

//Database
client.profiles = new Jsondb('./db/economy/profiles.json');
client.db = new Jsondb('./db/util/db.json');
const users = new Jsondb('./db/util/users.json');
db.wallet = new Jsondb('./db/economy/wallet.json');
db.bank = new Jsondb('./db/economy/bank.json');
db.welcome = new Jsondb('./db/config/welcome.json');
db.money = '<:money:989363629382062080>';


process.client = client;
process.db = db;
process.Discord = Discord;
const fs = require("fs");

module.exports = client;

//event poor edition
require('./events/client/ready.js')(client);
   require('./events/client/interactionCreate.js')(client, users, Discord);
client.scommand = new Discord.Collection();
const scommands = fs.readdirSync('./SlashCommands').filter(file => file.endsWith('.js'));
console.log(chalk.red('[Commands] Loading Commands'));
for (file of scommands) {
  const commandName = file.split('.')[0];
  const command = require(`./SlashCommands/${commandName}`);
  client.scommand.set(commandName, command);
  console.log(chalk.green(`[Commands] ${commandName} Loaded`))
}                                     


client.profiles = new Discord.Collection();
client.commands = new Discord.Collection();
  

 client.login(process.env.TOKEN);
//db.login(process.env.TOKEN)

console.log(chalk.red(`[Commands] Loaded ${client.scommand.size} / Commands`));
   
 console.log(chalk.green('[Express] Starting Http Server'))
console.log(chalk.blue('[Client] Total Guilds: ' + client.guilds.cache.size));
   const express = require('express');
const app = express();
app.listen(8080);
app.get('/', (req, res) => {
const jsonString = {
  guilds: client.guilds.cache.size,
  
}
res.json(jsonString)
});


process.on("unhandledRejection", (reason, p) => {
 console.log(" [antiCrash] :: Unhandled Rejection/Catch");
 console.log(reason, p);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
 console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
 console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
 console.log("[Anti Crash] :: Bot Crashed");
 console.log(type, promise, reason);
}); 
//by Xanny

process.leo = '865903011593977896'
process.rohan = '922419431508938773'