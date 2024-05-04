const JSONdb = require('simple-json-db');

module.exports = async (userId) => {
  if (!userId) throw new Error("No User ID Provided When Creating Profile.");
  if (isNaN(userId)) throw new Error("Invalid User ID Provided While Creating Profile.");
  try {
    const user = await process.client.users.fetch(userId);
    const profile = new JSONdb(`../../Database/${userId}.json`);
    await profile.set("username", user.username);
    await profile.set("userID", userId);
    await profile.set("balance", 0);
    await profile.set("bank", 0);
    return { profile };
  } catch (error) {
    console.error("Error creating profile:", error);
  }
};