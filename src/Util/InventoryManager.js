const EconomyManager = require('./EconomyManager.js');
const { items } = require('./Items');

const InventoryManager = {
	async AddItem(userID, itemID, amount = 1) {
		const { db, profile } = await EconomyManager.GetProfile(userID);
		const item = profile.inventory.find((i) => i.id === itemID);
		if (item) {
			item.quantity += amount;
		}
		else {
			const itemDetails = items.find((i) => i.id === itemID);
			if (itemDetails) {
				profile.inventory.push({
					id: itemID,
					name: itemDetails.name,
					quantity: amount,
				});
			}
		}
		db.set('inventory', profile.inventory);
		return profile.inventory;
	},

	async RemoveItem(userID, itemID, amount = 1) {
		const { db, profile } = await EconomyManager.GetProfile(userID);
		const item = profile.inventory.find((i) => i.id === itemID);
		if (item) {
			if (item.quantity > amount) {
				item.quantity -= amount;
			}
			else {
				profile.inventory = profile.inventory.filter((i) => i.id !== itemID);
			}
			db.set('inventory', profile.inventory);
		}
		return profile.inventory;
	},

	async GetInventory(userID) {
		const { profile } = await EconomyManager.GetProfile(userID);
		const inventoryWithNames = profile.inventory.map((item) => {
			const itemDetails = items.find((i) => i.id === item.id);
			return {
				...item,
				name: itemDetails ? itemDetails.name : 'Unknown',
			};
		});
		return inventoryWithNames;
	},
};

module.exports = InventoryManager;
