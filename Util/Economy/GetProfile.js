const JSONdb = require('simple-json-db');
const CreateProfile = require("./CreateProfile")
module.exports = async (userId) => {
  if(!userId) throw new Error("No User ID Provided When Fetching Profile.");
  if(isNaN(userId)) throw new Error("Invalid User ID Provided While Fetching Profile.");
  
  const userProfile = new JSONdb(`../../Database/${userId}.json`);
  const username = await userProfile.get("name");
  if(!username) return CreateProfile(userId);
  return { Profile };
};