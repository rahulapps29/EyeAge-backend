require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const EyeEntry = require("./models/EyeEntry");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await User.deleteMany();
    await EyeEntry.deleteMany();

    // Create users
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = await User.insertMany([
      {
        email: "alice@example.com",
        password: hashedPassword,
        firstName: "Alice",
        lastName: "Anderson",
      },
      {
        email: "bob@example.com",
        password: hashedPassword,
        firstName: "Bob",
        lastName: "Baker",
      },
      {
        email: "charlie@example.com",
        password: hashedPassword,
        firstName: "Charlie",
        lastName: "Clark",
      },
    ]);

    // Create an eye entry for Alice and share it with Bob and Charlie
    const entry = await EyeEntry.create({
      user: users[0]._id,
      rightEye: {
        distance: { sph: -1.25, cyl: -0.5, axis: 180 },
        near: { sph: -0.75, cyl: -0.25, axis: 170 },
      },
      leftEye: {
        distance: { sph: -1.0, cyl: -0.5, axis: 170 },
        near: { sph: -0.5, cyl: -0.25, axis: 160 },
      },
      sv: true,
      bf: false,
      prog: true,
      hc: false,
      hmc: true,
      bc: true,
      poly: false,
      trio: true,
      violet: false,
      totalAmount: 2500,
      advanceAmount: 1000,
      sharedWith: [users[1]._id, users[2]._id],
    });

    console.log("✅ Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();
