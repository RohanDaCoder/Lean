const DB = require("simple-json-db");
const fs = require("fs");

module.exports = (interaction, client) => {
  let dbPath = `../../Database/${interaction.user.id}.json`
  fs.appendFile(dbPath, '{}');
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
};