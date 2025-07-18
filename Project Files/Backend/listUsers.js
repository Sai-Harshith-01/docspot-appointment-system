const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/userModel");

async function listUsers() {
  await mongoose.connect(process.env.DATABASE);
  const users = await User.find();
  console.log("All users in the database:");
  users.forEach(user => {
    console.log({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      isDoctor: user.isDoctor
    });
  });
  mongoose.disconnect();
}

listUsers(); 