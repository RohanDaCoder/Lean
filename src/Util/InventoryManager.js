const EconomyUser = require('../Models/EconomyUser');
const { items } = require('./Items');

const InventoryManager = {
  async findOrCreateUser(userID) {
    try {
      let user = await EconomyUser.findOne({ userID });
      if (!user) {
        user = await EconomyUser.create({ userID });
      }
      return user;
    } catch (err) {
      console.error('Error finding or creating user:', err);
      return null;
    }
  },

  async AddItem(userID, itemID, amount = 1) {
    try {
      let user = await this.findOrCreateUser(userID);
      if (!user) return [];

      let inventory = user.inventory.find(i => i.itemID === itemID);
      if (inventory) {
        inventory.quantity += amount;
      } else {
        const itemDetails = items.find(i => i.id === itemID);
        if (!itemDetails) {
          console.error(`Item with ID ${itemID} not found.`);
          return user.inventory;
        }
        user.inventory.push({
          itemID,
          name: itemDetails.name,
          quantity: amount,
        });
      }

      await user.save();
      return user.inventory;
    } catch (err) {
      console.error('Error adding item to inventory:', err);
      return [];
    }
  },

  async RemoveItem(userID, itemID, amount = 1) {
    try {
      let user = await this.findOrCreateUser(userID);
      if (!user) return [];

      let inventory = user.inventory.find(i => i.itemID === itemID);
      if (inventory) {
        if (inventory.quantity > amount) {
          inventory.quantity -= amount;
        } else {
          user.inventory = user.inventory.filter(i => i.itemID !== itemID);
        }

        await user.save();
      }

      return user.inventory;
    } catch (err) {
      console.error('Error removing item from inventory:', err);
      return [];
    }
  },

  async GetInventory(userID) {
    try {
      let user = await EconomyUser.findOne({ userID });
      if (!user) return [];

      const inventoryWithNames = user.inventory.map(item => {
        const itemDetails = items.find(i => i.id === item.itemID);
        return {
          ...item.toObject(),
          name: itemDetails ? itemDetails.name : 'Unknown',
        };
      });

      return inventoryWithNames;
    } catch (err) {
      console.error('Error fetching inventory:', err);
      return [];
    }
  },
};

module.exports = InventoryManager;