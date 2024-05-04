const DB = require("simple-json-db");
const fs = require("fs");
const path = require("path");

module.exports = (interaction, client) => {
  let dbPath = path.join(__dirname, `../../Database/${interaction.user.id}.json`);
  fs.writeFile(dbPath, '{}', 'utf8', function(e) {
    if (e) return interaction.channel.send(`Failed To Check Balance. \nError: ${e.message}`);
    const profile = new DB(dbPath);
    if (profile.has("userID")) return;
    const defaultProfile = {
      name: interaction.user.username,
      userID: interaction.user.id,
      wallet: 0,
      bank: 0,
      inventory: []
    };

    profile.set("name", defaultProfile.name);
    profile.set("userID", defaultProfile.userID);
    profile.set("wallet", defaultProfile.wallet);
    profile.set("bank", defaultProfile.bank);
    profile.set("inventory", defaultProfile.inventory);
  });
};