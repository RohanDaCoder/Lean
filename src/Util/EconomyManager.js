const EconomyUser = require("../Models/EconomyUser");
const { emojis } = require("../config.js");

const EconomyManager = {
  async GetProfile(userID) {
    let profile = await EconomyUser.findOne({ userID });

    if (!profile) {
      profile = await EconomyUser.create({ userID });
    }

    return profile;
  },

  async SetMoney({ userID, balance, amount }) {
    const profile = await this.GetProfile(userID);
    profile[balance] = Math.min(amount, 1e9);
    await profile.save();
    return Math.min(amount, 1e9);
  },

  async GetMoney({ userID, balance }) {
    const profile = await this.GetProfile(userID);
    const formattedAmount = profile[balance]
      ? this.formatMoney(profile[balance])
      : this.formatMoney(0);
    return {
      raw: profile[balance] || 0,
      formatted: formattedAmount,
    };
  },

  async set({ userID, key, value }) {
    const profile = await this.GetProfile(userID);
    profile[key] = value;
    await profile.save();
  },

  async get({ userID, key }) {
    const profile = await this.GetProfile(userID);
    return profile[key];
  },

  formatMoney(amount) {
    if (amount >= 1e9) {
      return `${(amount / 1e9).toFixed(1)}b ${emojis.money}`;
    } else if (amount >= 1e6) {
      return `${(amount / 1e6).toFixed(1)}m ${emojis.money}`;
    } else if (amount >= 1e3) {
      return `${(amount / 1e3).toFixed(1)}k ${emojis.money}`;
    } else {
      return `${amount} ${emojis.money}`;
    }
  },
};

module.exports = EconomyManager;
