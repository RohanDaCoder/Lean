const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const colors = require("colors");

const devGuildIds = ["1244254187014066226"];
let commandsDeployed = false; 

async function deployCommands(client, commandDataArray) {
  if (commandsDeployed) return;
  commandsDeployed = true;

  if (!Array.isArray(commandDataArray)) {
    throw new TypeError('commandDataArray should be an array');
  }

  if (client.isReady()) {
    await handleLoading(client, commandDataArray);
  } else {
    client.once("ready", async () => {
      await handleLoading(client, commandDataArray);
    });
  }
}

async function handleLoading(client, commandDataArray) {
  const validCommands = commandDataArray.filter(cmd =>
    !cmd.options?.deleted &&
    cmd.name &&
    cmd.description
  );

  const devOnlyCommands = validCommands.filter(cmd => cmd.options?.devOnly);
  const globalCommands = validCommands.filter(cmd => !cmd.options?.devOnly);

  await Promise.all([
    loadDevCommands(client, devOnlyCommands),
    loadGlobalCommands(client, globalCommands)
  ]);
}

async function loadGlobalCommands(client, commands) {
  try {
    await client.application.commands.set(commands);
    console.log(colors.green(`Loaded ${commands.length} global commands.`));
    console.log(colors.green(`Total Commands: ${client.totalCommands}`));
  } catch (error) {
    console.error(colors.red("Error loading global application commands.\n"), error);
  }
}

async function loadDevCommands(client, commands) {
  for (const guildId of devGuildIds) {
    try {
      const targetGuild = await client.guilds.fetch(guildId);

      if (!targetGuild) {
        console.warn(
          `Cannot load commands in guild "${guildId}" - guild doesn't exist or client isn't part of the guild.`
        );
        continue;
      }

      await targetGuild.commands.set(commands);
      console.log(
        colors.green(
          `Loaded ${commands.length} developer commands in guild "${targetGuild.name}".`
        )
      );
    } catch (error) {
      console.error(
        colors.red(
          `Error loading developer application commands in guild "${guildId}".\n`
        ),
        error
      );
    }
  }
}

module.exports = async (client) => {
  client.totalCommands = 0;
  const commands = new Collection();
  const commandDataArray = [];
  const commandFiles = fs.readdirSync(path.join(__dirname, "../../Commands"), { withFileTypes: true });

  for (const file of commandFiles) {
    if (file.isDirectory()) {
      const category = file.name;
      const categoryPath = path.join(__dirname, "../../Commands", category);
      const categoryCommandFiles = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".js"));

      for (const commandFile of categoryCommandFiles) {
        try {
          const command = require(path.join(categoryPath, commandFile));
          if (command.data && command.data.name && command.data.description) {
            commands.set(command.data.name, command);
            commandDataArray.push(command.data);
            client.totalCommands++;
          } else {
            console.warn(`Command ${commandFile} in category ${category} is missing required properties.`);
          }
        } catch (error) {
          console.error(`Error loading command ${commandFile} in category ${category}:`, error);
        }
      }
    }
  }

  client.commands = commands;

  try {
    await deployCommands(client, commandDataArray);
  } catch (error) {
    console.error("Error deploying commands:", error);
  }
};