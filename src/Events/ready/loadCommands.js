const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const color = require("colors");
module.exports = (client) => {
  //Load Commands
  let totalCommands = 0;
  const commands = new Collection();
  const categories = fs.readdirSync(path.join(__dirname, "../../Commands"));

  categories.forEach(async (category) => {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, "../../Commands", category))
      .filter((file) => file.endsWith(".js"));

    commandFiles.forEach((file) => {
      const command = require(`../../Commands/${category}/${file}`);
      commands.set(command.data.name, command);
      totalCommands++;
    });
  });
  /* eslint-disable-next-line no-console */
  console.log(color.blue(`[Commands] Loaded ${totalCommands} Commands`));
  client.commands = commands;
};
