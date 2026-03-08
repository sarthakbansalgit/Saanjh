const mongoose = require('mongoose');
const User = require('./backend/models/User');

async function fix() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/perfectmatch');
        const users = await User.find();
        console.log(`Found ${users.length} users. Checking for required fields...`);

        for (const u of users) {
            let changed = false;

            if (!u.age) { u.age = "25"; changed = true; }
            if (!u.gender) { u.gender = "Male"; changed = true; }
            if (!u.interestsSent) { u.interestsSent = []; changed = true; }
            if (!u.interestsReceived) { u.interestsReceived = []; changed = true; }
            if (!u.matches) { u.matches = []; changed = true; }

            if (changed) {
                console.log(`Fixing user: ${u.email}`);
                await u.save();
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
