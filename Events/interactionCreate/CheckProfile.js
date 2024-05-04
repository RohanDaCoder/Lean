const DB = require("simple-json-db");


module.exports = (interaction, client) => {
  const profile = new DB(`../../Database/${interaction.user.id}.json`);
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