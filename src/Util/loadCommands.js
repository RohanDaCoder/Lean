/* eslint-disable no-console */
const colors = require("colors");

async function loadCommands(client, commands, devGuildIds) {
  if (client.isReady()) {
    await handleLoading(client, commands, devGuildIds);
  } else {
    client.once("ready", async (c) => {
      await handleLoading(c, commands, devGuildIds);
    });
  }
}

async function handleLoading(client, commands, devGuildIds) {
  commands = commands.filter((cmd) => !cmd.options?.deleted);
  const devOnlyCommands = commands.filter((cmd) => cmd.options?.devOnly);
  const globalCommands = commands.filter((cmd) => !cmd.options?.devOnly);

  await loadDevCommands(client, devOnlyCommands, devGuildIds);
  await loadGlobalCommands(client, globalCommands);
}

async function loadGlobalCommands(client, commands) {
  const requestBody = commands.map((cmd) => cmd.data);

  await client.application.commands.set(requestBody).catch((error) => {
    throw new Error(
      colors.red(`Error loading global application commands.\n`),
      error,
    );
  });

  console.log(colors.green(`Loaded ${requestBody.length} global commands.`));
}

async function loadDevCommands(client, commands, guildIds) {
  const requestBody = commands.map((cmd) => cmd.data);

  for (const guildId of guildIds) {
    const targetGuild =
      client.guilds.cache.get(guildId) || (await client.guilds.fetch(guildId));

    if (!targetGuild) {
      process.emitWarning(
        `Cannot load commands in guild "${guildId}" - guild doesn't exist or client isn't part of the guild.`,
      );

      continue;
    }

    await targetGuild.commands.set(requestBody).catch((error) => {
      throw new Error(
        colors.red(
          `Error loading developer application commands in guild "${targetGuild?.name || guildId}".\n`,
        ),
        error,
      );
    });

    console.log(
      colors.green(
        `Loaded ${requestBody.length} developer commands in guild "${targetGuild.name}".`,
      ),
    );
  }
}

module.exports = loadCommands;
