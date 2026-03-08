const mongoose = require('mongoose');
const User = require('./models/User');

async function fix() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect('mongodb://127.0.0.1:27017/perfectmatch');
        const users = await User.find();
        console.log(`Found ${users.length} users. Checking for required fields...`);

        for (const u of users) {
            let changed = false;

            // Age is required in schema
            if (!u.age) { u.age = "25"; changed = true; }
            // Gender is required in schema
            if (!u.gender) { u.gender = "Male"; changed = true; }
            // Arrays should be initialized 
            if (!u.interestsSent) { u.interestsSent = []; changed = true; }
            if (!u.interestsReceived) { u.interestsReceived = []; changed = true; }
            if (!u.matches) { u.matches = []; changed = true; }
            if (!u.dailyInterests) { u.dailyInterests = { date: "2024-01-01", count: 0 }; changed = true; }

            if (changed) {
                console.log(`Fixing user: ${u.email}`);
                // Use validateBeforeSave: false if needed, but better to fix fields
                await u.save().catch(err => {
                    console.error(`FAILED to save ${u.email}:`, err.message);
                });
            }
        }
        console.log("Database repair complete.");
    } catch (e) {
        console.error("DEBUG REPAIR FAILED", e);
    } finally {
        await mongoose.disconnect();
    }
}

fix();
