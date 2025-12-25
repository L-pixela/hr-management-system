const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    default: ["EMPLOYEE"]
  },
  isLocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
