const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  country: { type: String },
  profile_pic: { type: String },
  verificationToken: { type: String },
  verified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user", "admin"], // Only "customer" and "admin" are allowed values
    default: "user", // Default role is "customer"
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
