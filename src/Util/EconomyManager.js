const fs = require("fs");
const path = require("path");
const Database = require("./Database"); // Import the Database class
const { emojis } = require("../config.js");

// Default profile template
const defaultProfile = (id) => ({
  id,
  wallet: 0,
  bank: 0,
  inventory: [],
  daily: null,
  weekly: null,
  monthly: null,
});

// Utility function to get the profile path
const getProfilePath = (userID) =>
  path.join(__dirname, `../Database/Profiles/${userID}.json`);

const EconomyManager = {
  formatMoney(amount) {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}b ${emojis.money}`;
    else if (amount >= 1e6)
      return `${(amount / 1e6).toFixed(1)}m ${emojis.money}`;
    else if (amount >= 1e3)
      return `${(amount / 1e3).toFixed(1)}k ${emojis.money}`;
    else return `${amount} ${emojis.money}`;
  },

  async GetProfile(userID) {
    const profilePath = getProfilePath(userID);
    if (!fs.existsSync(profilePath)) {
      fs.writeFileSync(profilePath, JSON.stringify(defaultProfile(userID)));
    }
    const profileDb = new Database(profilePath);
    let profile = profileDb.toJSON();
    if (profile.id !== userID) {
      profile.id = userID;
      profileDb.set("id", userID);
    }
    return { db: profileDb, profile };
  },

  async SetMoney(o) {
    const { db } = await this.GetProfile(o.userID);
    if (o.amount !== undefined && o.userID !== undefined && db) {
      await db.set(o.balance, Math.min(o.amount, 1e9));
      return Math.min(o.amount, 1e9);
    }
    return 0;
  },

  async GetMoney(i) {
    const { db } = await this.GetProfile(i.userID);
    const amount = await db.get(i.balance);
    const formattedAmount =
      amount !== undefined ? this.formatMoney(amount) : this.formatMoney(0);
    return {
      raw: amount !== undefined ? amount : 0,
      formatted: formattedAmount,
    };
  },

  async set(o) {
    const { db } = await this.GetProfile(o.userID);
    await db.set(o.key, o.value);
  },

  async get(o) {
    const { db } = await this.GetProfile(o.userID);
    const value = await db.get(o.key);
    return value;
  },
};

module.exports = EconomyManager;
