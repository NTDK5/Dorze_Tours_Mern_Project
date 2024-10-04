const mongoose = require("mongoose");
const User = require("./models/userModel.js");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = new User({
      first_name: "Natan",
      last_name: "Tamiru",
      email: "admin@gmail.com",
      password: "password",
      role: "admin",
    });

    const res = await admin.save();
    console.log(res);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin user:", error);
    mongoose.connection.close();
  }
};

createAdmin();
