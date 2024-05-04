const JSONdb = require('simple-json-db');

module.exports = async (userId, client) => {
  if (!userId) throw new Error("No User ID Provided When Creating Profile.");
  if (isNaN(userId)) throw new Error("Invalid User ID Provided While Creating Profile.");


  try {
    const user = await client.users.fetch(userId);
  } catch (error) {
    throw new Error("That User Does Not Exist.");
  }

  const profile = new JSONdb(`../../Database/${userId}.json`);
  await profile.set("username", user.username);
  await profile.set("userID", userId);
  await profile.set("balance", 0);
  await profile.set("bank", 0);
}