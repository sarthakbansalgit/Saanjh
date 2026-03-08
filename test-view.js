const axios = require('axios');
const mongoose = require('mongoose');

async function test() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/perfectmatch');
        const User = require('./backend/models/User');
        const users = await User.find();
        mongoose.disconnect();

        console.log("Found users length: ", users.length);
        if (users.length < 2) return;

        const token = "dummyToken"; // I can't guess token easily if it's jwts.

    } catch (e) {
        console.log("Error:", e);
    }
}
test();
