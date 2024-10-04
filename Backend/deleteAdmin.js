const mongoose = require("mongoose");
const User = require("./models/userModel.js");
const dotenv = require("dotenv");

dotenv.config();

const deleteAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email, role: "admin" });

    if (!user) {
      console.log("Admin user not found");
      mongoose.connection.close();
      return;
    }

    await User.deleteOne({ _id: user._id });
    console.log(`Admin user with email ${email} deleted!`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error deleting admin user:", error);
    mongoose.connection.close();
  }
};

// Call the deleteAdmin function with the email of the admin you want to delete
deleteAdmin("admin@gmail.com");
