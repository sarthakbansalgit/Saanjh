const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env" });
const User = require("./models/User");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const salt = bcrypt.genSaltSync(10);
    const hashAdmin = bcrypt.hashSync("password123", salt);
    const hashUser = bcrypt.hashSync("password123", salt);

    // Admin
    await Admin.deleteMany({ email: "admin@saanjh.com" });
    await Admin.create({ email: "admin@saanjh.com", password: hashAdmin });

    // Boy
    await User.deleteMany({ email: "boy@saanjh.com" });
    await User.create({ email: "boy@saanjh.com", password: hashUser, name: "Rahul Sharma", gender: "Male", phone: "9876543210", age: 28, height: "180", caste: "Khatri", religion: "Hindu", motherTongue: "Punjabi" });

    // Girl
    await User.deleteMany({ email: "girl@saanjh.com" });
    await User.create({ email: "girl@saanjh.com", password: hashUser, name: "Priya Singh", gender: "Female", phone: "9876543211", age: 26, height: "165", caste: "Jat", religion: "Sikh", motherTongue: "Punjabi" });

    console.log("Database accounts reset!");
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
