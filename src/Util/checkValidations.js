const fs = require("fs").promises;
const path = require("path");

module.exports = async (client, interaction, runCommand) => {
  if (!runCommand || typeof runCommand !== "function") {
    throw new TypeError(
      `runCommand function is required when running validations.`,
    );
  }

  try {
    const validationsDir = path.resolve(__dirname, "../Validations");
    const validationFiles = await fs.readdir(validationsDir);

    for (const file of validationFiles) {
      try {
        const check = require(path.join(validationsDir, file));
        const shouldStopCommand = await check({ client, interaction });

        if (shouldStopCommand) {
          return;
        }
      } catch (error) {
        console.error(`Error in validation module '${file}':`, error);
      }
    }

    await runCommand({ client, interaction });
  } catch (error) {
    console.error(`Error while running validations:`, error);
  }
};
