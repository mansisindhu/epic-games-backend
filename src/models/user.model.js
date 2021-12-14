const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    orders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "games", required: false },
    ],
    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "games", required: false },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
