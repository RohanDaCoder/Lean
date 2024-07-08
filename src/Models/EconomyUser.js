const mongoose = require("mongoose");

const economyUserSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  bank: {
    type: Number,
    default: 0,
  },
  inventory: [
    {
      itemID: String,
      quantity: Number,
    },
  ],
});

const EconomyUser = mongoose.model("EconomyUser", economyUserSchema);

module.exports = EconomyUser;
