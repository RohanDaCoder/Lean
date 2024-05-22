const SimpleJsonDB = require("simple-json-db");
const fs = require("fs");
const path = require("path");
const { emojis } = require("../config.js");

const defaultProfile = (id) => ({
  id,
  wallet: 0,
  bank: 0,
  inventory: [],
  daily: null,
  weekly: null,
  monthly: null,
});

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
    const dbPath = path.join(__dirname, `../Database/Profiles/${userID}.json`);
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(defaultProfile(userID)));
    }
    const db = new SimpleJsonDB(dbPath);
    const profile = db.JSON();
    if (profile.id !== userID) {
      db.set("id", userID);
    }
    return { db, profile };
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
    await db.get(o.key, o.value);
  },
};

module.exports = EconomyManager;
