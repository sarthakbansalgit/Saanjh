require("dotenv").config({path: ".env"});
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  console.log("Connected");
  const salt = await bcrypt.genSalt(10);
  const secPassword = await bcrypt.hash("password123", salt);

  // Admin
  if (!await Admin.findOne({ email: "admin@saanjh.com" })) {
    await Admin.create({ email: "admin@saanjh.com", password: secPassword });
  }

  // Boy
  if (!await User.findOne({ email: "boy@saanjh.com" })) {
    await User.create({ email: "boy@saanjh.com", password: secPassword, fname: "Rahul", lname: "Sharma", gender: "Male", cno: "9876543210" });
  }

  // Girl
  if (!await User.findOne({ email: "girl@saanjh.com" })) {
    await User.create({ email: "girl@saanjh.com", password: secPassword, fname: "Priya", lname: "Singh", gender: "Female", cno: "9876543211" });
  }

  console.log("Seeded!");
  process.exit();
}).catch(e => console.error(e));
