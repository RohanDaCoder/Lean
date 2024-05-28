const fs = require("fs").promises;

class Database {
  constructor(filePath) {
    if (!filePath) throw new Error("Missing file path argument.");
    this.filePath = filePath;
    this.storage = {}; // Temporary storage until initialization
    this.initialized = this._init();
  }

  async _init() {
    try {
      const fileExists = await fs
        .access(this.filePath)
        .then(() => true)
        .catch(() => false);
      if (!fileExists) {
        await fs.writeFile(this.filePath, "{}");
      }
      const data = await fs.readFile(this.filePath, "utf8");
      this.storage = JSON.parse(data);
    } catch (err) {
      throw new Error(`Initialization error: ${err.message}`);
    }
  }

  async _write() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.storage, null, 4));
    } catch (err) {
      throw new Error(`Error writing to file: ${err.message}`);
    }
  }

  async set(key, value) {
    await this.initialized;
    this.storage[key] = value;
    await this._write();
  }

  async get(key) {
    await this.initialized;
    return this.storage[key];
  }

  async has(key) {
    await this.initialized;
    return key in this.storage;
  }

  async delete(key) {
    await this.initialized;
    if (this.has(key)) {
      delete this.storage[key];
      await this._write();
      return true;
    }
    return false;
  }

  async deleteAll() {
    await this.initialized;
    this.storage = {};
    await this._write();
  }

  async toJSON() {
    await this.initialized;
    return { ...this.storage };
  }

  async fromJSON(json) {
    await this.initialized;
    this.storage = JSON.parse(JSON.stringify(json));
    await this._write();
  }
}

module.exports = Database;