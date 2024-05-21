const EconomyManager = require("./EconomyManager.js");

const InventoryManager = {
  async AddItem(userID, item) {
    const { db, profile } = await EconomyManager.GetProfile(userID);
    profile.inventory.push(item);
    db.set("inventory", profile.inventory);
    return profile.inventory;
  },

  async RemoveItem(userID, item) {
    const { db, profile } = await EconomyManager.GetProfile(userID);
    const itemIndex = profile.inventory.findIndex((i) => i === item);
    if (itemIndex > -1) {
      profile.inventory.splice(itemIndex, 1);
      db.set("inventory", profile.inventory);
    }
    return profile.inventory;
  },

  async GetInventory(userID) {
    const { profile } = await EconomyManager.GetProfile(userID);
    return profile.inventory;
  },
};

module.exports = InventoryManager;
