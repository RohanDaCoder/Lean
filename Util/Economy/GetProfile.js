const JSONdb = require('simple-json-db');
const CreateProfile = require("./CreateProfile");

module.exports = async (userId, client) => {
  if (!userId) throw new Error("No User ID Provided When Fetching Profile.");
  if (isNaN(userId)) throw new Error("Invalid User ID Provided While Fetching Profile.");

  const userProfile = new JSONdb(`../../Database/${userId}.json`);
  let username = await userProfile.get("username");
  let Profile = userProfile;

  if (!username) {
    try {
      const { profile } = await CreateProfile(userId, client);
      Profile = profile;
      username = await Profile.get("username");
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  }

  return { username, Profile };
};