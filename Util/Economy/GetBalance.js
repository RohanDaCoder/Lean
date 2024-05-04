//Importing Modules
const JSONdb = require('simple-json-db');
const GetProfile = require("./GetProfile.js")
const { emojis } = require("../../config.js");

module.exports = async (userId) => {
  //Error Handling
  if (!userId) throw new Error("No User ID Provided When Fetching Balance.");
  if (isNaN(userId)) throw new Error("Invalid User ID Provided While Fetching Balance.");
  
  //Get Values From Database
  const profile = GetProfile(userId);
  const wallet = profile.get("balance");
  const bank = profile.get("bank");
  //Formatting
  const walletFormated = `${wallet.toLocaleString()}${emojis.money}`;
  const bankFormated = `${bank.toLocaleString()}${emojis.money}`;
  //Returning Values
  return { wallet, bank, walletFormated, bankFormated }
};