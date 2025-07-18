const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/userModel");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE);

    // Delete all existing users
    await User.deleteMany({});
    console.log("All existing users deleted.");

    // Create new admin user
    const hashedPassword = await bcrypt.hash("harshith@1234", 12);

    const admin = new User({
      name: "harshith",
      email: "harshith1234@gmail.com",
      phoneNumber: "9999998888",
      password: hashedPassword,
      isAdmin: true,
      isDoctor: false,
    });

    await admin.save();
    console.log("Admin user created!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
