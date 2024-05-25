const fs = require("fs");

class Database {
  constructor(filePath) {
    if (!filePath) throw new Error("Missing file path argument.");
    this.filePath = filePath;
    this.storage = this._init();
  }

  async _init() {
    try {
      if (!fs.existsSync(this.filePath))
        await fs.writeFileSync(this.filePath, "{}");
      const data = await fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (err) {
      throw new Error(`Initialization error: ${err.message}`);
    }
  }

  async _write() {
    try {
      await fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.storage, null, 4),
      );
    } catch (err) {
      throw new Error(`Error writing to file: ${err.message}`);
    }
  }

  set(key, value) {
    this.storage[key] = value;
    this._write();
  }

  get(key) {
    return this.storage[key];
  }

  has(key) {
    return key in this.storage;
  }

  delete(key) {
    if (this.has(key)) {
      delete this.storage[key];
      this._write();
      return true;
    }
    return false;
  }

  deleteAll() {
    this.storage = {};
    this._write();
  }

  toJSON() {
    return { ...this.storage };
  }

  fromJSON(json) {
    this.storage = JSON.parse(JSON.stringify(json));
    this._write();
  }
}

module.exports = Database;
