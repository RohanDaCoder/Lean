const SimpleJsonDB = require("simple-json-db");
const fs = require("fs");

class EconomyManager {
  async ModifyMoney(i) {
    if (!i) throw new Error(`No valid options provided when modifying money.`);
    if (!i.userID) throw new Error(`Invalid user ID provided.`);
    if (!i.type) i.type = "wallet";
    let prefix = i.type === "bank" ? "bank" : "wallet";
    let db = await this.getProfile(i.userID);

    if (i.set) await db.set(`${prefix}_${i.userID}`, i.set);
    if (i.add) {
      let currentMoney = await this.fetchMoney({
        userID: i.userID,
        type: i.type,
      });
      await db.set(`${prefix}_${i.userID}`, currentMoney + i.add);
    }
    if (i.reduce) {
      let currentMoney = await this.fetchMoney({
        userID: i.userID,
        type: i.type,
      });
      await db.set(`${prefix}_${i.userID}`, currentMoney - i.reduce);
    }
    return true;
  }

  async getProfile(userID) {
    try {
      if (!userID || typeof userID !== "number")
        throw new Error(`Invalid UserID Provided.`);
      const dbPath = `../Database/${userID}.json`;

      if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}));
      }

      const db = new SimpleJsonDB(dbPath);
      return db;
    } catch (error) {
      console.error("Error getting profile:", error);
    }
  }

  async fetchMoney(i) {
    try {
      if (!i || !i.userID || !i.type)
        throw new Error(`Invalid options provided.`);
      let db = await this.getProfile(i.userID);
      let prefix = i.type === "bank" ? "bank" : "wallet";
      const amount = await db.get(`${prefix}_${i.userID}`);
      return amount;
    } catch (error) {
      console.error("Error fetching money:", error);
      return 0;
    }
  }
  async daily(userID, amount) {
    if (!userID) throw new Error("User id was not provided!");
    if (!amount) amount = this.random(100, 250);
    const newAmount = await this.ModifyMoney({
      userID,
      add: amount,
      type: "wallet",
    });
    return {
      amount,
      money: newAmount,
    };
  }

  async weekly(userID, amount) {
    if (!userID) throw new Error("User id was not provided!");
    if (!amount) amount = this.random(200, 750);
    const newAmount = await this.ModifyMoney({
      userID,
      add: amount,
      type: "wallet",
    });
    return {
      amount,
      money: newAmount,
    };
  }

  async monthly(userID, amount) {
    if (!userID) throw new Error("User id was not provided!");
    if (!amount) amount = this.random(1000, 5000);
    const newAmount = await this.ModifyMoney({
      userID,
      add: amount,
      type: "wallet",
    });
    return {
      amount,
      money: newAmount,
    };
  }

  async beg(userID, amount) {
    if (!userID) throw new Error("User id was not provided!");
    if (!amount) amount = this.random(1, 70);
    const newAmount = await this.ModifyMoney({
      userID,
      add: amount,
      type: "wallet",
    });
    return {
      amount,
      money: newAmount,
    };
  }

  async work(userID, amount) {
    if (!userID) throw new Error("User id was not provided!");
    if (!amount) amount = this.random(500, 1000);
    const newAmount = await this.ModifyMoney({
      userID,
      add: amount,
      type: "wallet",
    });
    return {
      amount,
      money: newAmount,
    };
  }

  async leaderboard(limit = 10) {
    let allData = [];
    const files = fs.readdirSync("../Database/");
    for (const file of files) {
      let userID = file.split(".")[0];
      let money = await this.fetchMoney({
        userID,
        type: "wallet",
      });
      allData.push({
        userID,
        money,
      });
    }
    allData = allData.sort((a, b) => b.money - a.money).slice(0, limit);
    return allData;
  }

  async reset() {
    const files = fs.readdirSync("../Database/");
    for (const file of files) {
      fs.unlinkSync(`../Database/${file}`);
    }
    return true;
  }

  random(a, b) {
    const number = Math.floor(Math.random() * (b - a + 1)) + a;
    return number;
  }
}

module.exports = EconomyManager;
