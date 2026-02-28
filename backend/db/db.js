const mongoose = require('mongoose');

const connectToMongo = () => {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/perfectmatch";
    mongoose.connect(MONGO_URI);
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    mongoose.connection.on('error', (err) => console.log('Connection failed - ', err));
};

module.exports = connectToMongo;
