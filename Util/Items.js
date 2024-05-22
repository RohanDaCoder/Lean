// Util/Items.js

const items = [
  {
    id: "sword",
    name: "Sword",
    description: "A sharp blade used for combat.",
    value: 100,
    rarity: "Common",
  },
  {
    id: "shield",
    name: "Shield",
    description: "Provides protection against attacks.",
    value: 150,
    rarity: "Uncommon",
  },
  {
    id: "potion",
    name: "Potion",
    description: "Heals a small amount of health.",
    value: 50,
    rarity: "Common",
  },
  {
    id: "magic_wand",
    name: "Magic Wand",
    description: "A wand with magical properties.",
    value: 300,
    rarity: "Rare",
  },
  // Add more items as needed
];

const getItemChoices = () =>
  items.map((item) => ({ name: item.name, value: item.id }));

module.exports = { items, getItemChoices };
