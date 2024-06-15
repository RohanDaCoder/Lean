const fs = require("fs").promises;
const path = require("path");

class Database {
  constructor(filePath) {
    if (!filePath) throw new Error("Missing file path argument.");
    this.filePath = filePath;
    this.storage = {}; // Temporary storage until initialization
    this.initialized = this._init();
  }

  async _init() {
    try {
      // Ensure the directory exists
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      
      // Read or create the file
      try {
        const data = await fs.readFile(this.filePath, "utf8");
        this.storage = JSON.parse(data);
      } catch (err) {
        if (err.code === "ENOENT") {
          await fs.writeFile(this.filePath, "{}");
        } else {
          throw err;
        }
      }
    } catch (err) {
      throw new Error(`Database Initialization error: ${err.message}`);
    }
  }

  async _write() {
    await fs.writeFile(this.filePath, JSON.stringify(this.storage, null, 4));
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