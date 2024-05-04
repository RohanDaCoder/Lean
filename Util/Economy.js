const Database = require("simple-json-db");

async function GetBalance(userID) {
  const Profile = new Database(`../Database/${userID}.json`);

  const wallet = Profile.get("balance");
  const bank = Profile.get("bank");
  //Formatting
  const walletFormated = `${wallet.toLocaleString()}${emojis.money}`;
  const bankFormated = `${bank.toLocaleString()}${emojis.money}`;
  //Returning Values
  return { wallet, bank, walletFormated, bankFormated };
}

module.exports = { GetBalance };