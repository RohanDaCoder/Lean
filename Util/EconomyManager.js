const SimpleJsonDB = require("simple-json-db");
const Util = require("./EconomyUtil");

class EconomyManager {
  constructor(
    options = {
      prefix: "money",
    },
  ) {
    this.prefix = options.prefix;
    this.db = new SimpleJsonDB("../Database.json");
  }

  async ModifyMoney(i) {
    if(!i) throw new Error(`No Options Provided When Modifying Money.`);
    if(!typeof i !== "object") throw new Error(`No Valid Option Provided When Modfiying Money.`);
    let prefix = (i.type === "bank") ? "bank" : (i.type === "wallet") ? "wallet" : "unknown";
    if(i.set) await db.set(`${prefix}_${i.userID}`, i.set);
    if(i.add) await db.set(`${prefix}_${i.userID}`, i.add + this.fetchMoney(i.userID));
    if(i.reduce) await db.set(`${prefix}_${i.userID}`, i.add - this.fetchMoney(i.userID));
    return true;
  }

  async all(limit = 0) {
    this.__checkManager();
    const data = this.db.JSON();
    if (limit < 1) return data || [];
    return Object.values(data).slice(0, limit) || [];
  }

  async fetchMoney(userID) {
    this.__checkManager();
    const userData = this.db.get(userID);
    if (!userData || isNaN(userData)) return 0;
    return userData;
  }

  async reset() {
    this.__checkManager();
    this.db.deleteAll();
    return true;
  }

  async daily(userID, amount) {
    this.__checkManager();
    if (!userID || typeof userID !== "string")
      throw new Error("User id was not provided!");
    if (!amount) amount = Util.random(100, 250);
    const key = `${userID}_daily`;
    const cooldownRaw = await this._get(key);
    const cooldown = Util.onCooldown(
      Util.COOLDOWN.DAILY,
      cooldownRaw ? cooldownRaw.data : 0,
    );
    if (cooldown)
      return {
        cooldown: true,
        time: Util.getCooldown(
          Util.COOLDOWN.DAILY,
          cooldownRaw ? cooldownRaw.data : 0,
        ),
      };
    const newAmount = await this.addMoney(userID, amount);
    await this._set(key, Date.now());
    return {
      cooldown: false,
      time: null,
      amount,
      money: newAmount,
    };
  }

  async weekly(userID, amount) {
    this.__checkManager();
    if (!userID || typeof userID !== "string")
      throw new Error("User id was not provided!");
    if (!amount) amount = Util.random(200, 750);
    const key = `${userID}_weekly`;
    const cooldownRaw = await this._get(key);
    const cooldown = Util.onCooldown(
      Util.COOLDOWN.WEEKLY,
      cooldownRaw ? cooldownRaw.data : 0,
    );
    if (cooldown)
      return {
        cooldown: true,
        time: Util.getCooldown(
          Util.COOLDOWN.WEEKLY,
          cooldownRaw ? cooldownRaw.data : 0,
        ),
      };
    const newAmount = await this.addMoney(userID, amount);
    await this._set(key, Date.now());
    return {
      cooldown: false,
      time: null,
      amount,
      money: newAmount,
    };
  }

  async monthly(userID, amount) {
    this.__checkManager();
    if (!userID || typeof userID !== "string")
      throw new Error("User id was not provided!");
    if (!amount) amount = Util.random(1000, 5000);
    const key = `${userID}_monthly`;
    const cooldownRaw = await this._get(key);
    const cooldown = Util.onCooldown(
      Util.COOLDOWN.MONTHLY,
      cooldownRaw ? cooldownRaw.data : 0,
    );
    if (cooldown)
      return {
        cooldown: true,
        time: Util.getCooldown(
          Util.COOLDOWN.MONTHLY,
          cooldownRaw ? cooldownRaw.data : 0,
        ),
      };
    const newAmount = await this.addMoney(userID, amount);
    await this._set(key, Date.now());
    return {
      cooldown: false,
      time: null,
      amount,
      money: newAmount,
    };
  }

  async beg(userID, amount) {
    this.__checkManager();
    if (!userID || typeof userID !== "string")
      throw new Error("User id was not provided!");
    if (!amount) amount = Util.random(1, 70);
    const key = `${userID}_beg`;
    const cooldownRaw = await this._get(key);
    const cooldown = Util.onCooldown(
      Util.COOLDOWN.BEG,
      cooldownRaw ? cooldownRaw.data : 0,
    );
    if (cooldown)
      return {
        cooldown: true,
        time: Util.getCooldown(
          Util.COOLDOWN.BEG,
          cooldownRaw ? cooldownRaw.data : 0,
        ),
      };
    const newAmount = await this.addMoney(userID, amount);
    await this._set(key, Date.now());
    return {
      cooldown: false,
      time: null,
      amount,
      money: newAmount,
    };
  }

  async work(userID, amount) {
    this.__checkManager();
    if (!userID || typeof userID !== "string")
      throw new Error("User id was not provided!");
    if (!amount) amount = Util.random(500, 1000);
    const key = `${userID}_work`;
    const cooldownRaw = await this._get(key);
    const cooldown = Util.onCooldown(
      Util.COOLDOWN.WORK,
      cooldownRaw ? cooldownRaw.data : 0,
    );
    if (cooldown)
      return {
        cooldown: true,
        time: Util.getCooldown(
          Util.COOLDOWN.WORK,
          cooldownRaw ? cooldownRaw.data : 0,
        ),
      };
    const newAmount = await this.addMoney(userID, amount);
    await this._set(key, Date.now());
    return {
      cooldown: false,
      time: null,
      amount,
      money: newAmount,
    };
  }

  async leaderboard(limit = 10) {
    this.__checkManager();
    let data = await this.all();
    data = data.sort((a, b) => b.value - a.value).slice(0, limit);
    return data.map((entry) => ({
      userID: entry.key,
      money: entry.value,
    }));
  }

  async _get(key) {
    this.__checkManager();
    if (typeof key !== "string") throw new Error("key must be a string!");
    const data = this.db.get(key);
    if (!data) return null;
    return data;
  }

  async fetchMoney(userID) {
    this.__checkManager();
    if (!userID || typeof userID !== "string")
      throw new Error("Invalid User ID!");
    const userData = this.db.get(userID);
    if (!userData || isNaN(userData)) {
      if (this.noNegative) await this.db.set(userID, 0);
      return 0;
    }
    if (this.noNegative && userData < 0) await this.db.set(userID, 0);
    return userData;
  }

  async _set(key, data) {
    this.__checkManager();
    if (typeof key !== "string") throw new Error("key must be a string!");
    if (typeof data === "undefined") data = 0;
    await this.db.set(key, data);
    return true;
  }

  async reset() {
    this.__checkManager();
    this.db.deleteAll();
    return true;
  }

  __checkManager() {
    if (!this.db) throw new Error("Manager is not ready yet!");
  }
}

module.exports = EconomyManager;
