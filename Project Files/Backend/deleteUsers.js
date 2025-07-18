const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/userModel");

async function deleteUsers() {
  await mongoose.connect(process.env.DATABASE);
  const result = await User.deleteMany({}); // Delete all users
  console.log("Deleted users:", result.deletedCount);
  mongoose.disconnect();
}

deleteUsers(); 