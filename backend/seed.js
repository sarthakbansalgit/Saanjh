require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfectmatch');
        console.log('Connected to DB');

        const girls = [
            {
                name: 'Kavya Sharma', email: 'kavya@test.com', phone: '9000000001', gender: 'Female',
                age: 24, dob: '2000-05-14', state: 'Delhi', district: 'New Delhi', religion: 'Hindu',
                caste: 'Brahmin', working: 'Private Sector', education: 'BTech/BE',
                height: 64, weight: 55, motherTongue: 'Hindi', maritalStatus: 'Never Married',
                description: 'Hi, I am Kavya. I love traveling and reading.', partnerPreference: 'Looking for a kind and settled man.',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                password: 'password123', createdBy: 'Self',
                interestsSent: [], interestsReceived: [], matches: [], dailyViews: { count: 0 }, dailyInterests: { count: 0 },
                createdAt: new Date()
            },
            {
                name: 'Neha Singh', email: 'neha@test.com', phone: '9000000002', gender: 'Female',
                age: 26, dob: '1998-08-22', state: 'Maharashtra', district: 'Mumbai', religion: 'Hindu',
                caste: 'Rajput', working: 'Business/Self Employed', education: 'MBA',
                height: 65, weight: 58, motherTongue: 'Marathi', maritalStatus: 'Never Married',
                description: 'Hello, I am Neha. I run a boutique.', partnerPreference: 'Looking for an ambitious partner.',
                image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                password: 'password123', createdBy: 'Self',
                interestsSent: [], interestsReceived: [], matches: [], dailyViews: { count: 0 }, dailyInterests: { count: 0 },
                createdAt: new Date()
            },
            {
                name: 'Priya Iyer', email: 'priya@test.com', phone: '9000000003', gender: 'Female',
                age: 25, dob: '1999-12-11', state: 'Karnataka', district: 'Bengaluru', religion: 'Hindu',
                caste: 'Brahmin', working: 'Private Sector', education: 'MTech',
                height: 62, weight: 52, motherTongue: 'Tamil', maritalStatus: 'Never Married',
                description: 'Software Engineer based in BLR.', partnerPreference: 'Looking for someone in IT.',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                password: 'password123', createdBy: 'Self',
                interestsSent: [], interestsReceived: [], matches: [], dailyViews: { count: 0 }, dailyInterests: { count: 0 },
                createdAt: new Date()
            }
        ];

        const boys = [
            {
                name: 'Rahul Verma', email: 'rahul@test.com', phone: '8000000001', gender: 'Male',
                age: 28, dob: '1996-03-10', state: 'Punjab', district: 'Chandigarh', religion: 'Hindu',
                caste: 'Khatri', working: 'Business/Self Employed', education: 'BCom',
                height: 70, weight: 75, motherTongue: 'Punjabi', maritalStatus: 'Never Married',
                description: 'I run a family business. Love exploring cafes.', partnerPreference: 'Looking for a supportive girl.',
                image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                password: 'password123', createdBy: 'Self',
                interestsSent: [], interestsReceived: [], matches: [], dailyViews: { count: 0 }, dailyInterests: { count: 0 },
                createdAt: new Date()
            },
            {
                name: 'Aryan Patil', email: 'aryan@test.com', phone: '8000000002', gender: 'Male',
                age: 27, dob: '1997-07-25', state: 'Maharashtra', district: 'Pune', religion: 'Hindu',
                caste: 'Maratha', working: 'Private Sector', education: 'BTech/BE',
                height: 69, weight: 72, motherTongue: 'Marathi', maritalStatus: 'Never Married',
                description: 'Tech lead at a startup.', partnerPreference: 'Someone smart and fun.',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                password: 'password123', createdBy: 'Self',
                interestsSent: [], interestsReceived: [], matches: [], dailyViews: { count: 0 }, dailyInterests: { count: 0 },
                createdAt: new Date()
            },
            {
                name: 'Kabir Das', email: 'kabir@test.com', phone: '8000000003', gender: 'Male',
                age: 29, dob: '1995-11-05', state: 'Delhi', district: 'New Delhi', religion: 'Hindu',
                caste: 'Arora', working: 'Govt Sector', education: 'MBA',
                height: 71, weight: 78, motherTongue: 'Hindi', maritalStatus: 'Never Married',
                description: 'Govt official. Classical music fan.', partnerPreference: 'Looking for a simple family girl.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                password: 'password123', createdBy: 'Self',
                interestsSent: [], interestsReceived: [], matches: [], dailyViews: { count: 0 }, dailyInterests: { count: 0 },
                createdAt: new Date()
            }
        ];

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash('password123', salt);
        const adminSecPass = await bcrypt.hash('admin123', salt);

        // Seed Users
        for (let u of [...girls, ...boys]) {
            const existing = await User.findOne({ email: u.email });
            if (!existing) {
                u.password = secPass;
                const newUser = new User(u);
                await newUser.save();
                console.log('Seeded:', u.name);
            } else {
                console.log('Already exists:', u.name);
            }
        }

        // Seed Admin Account (Sarthak)
        const Admin = require('./models/Admin');
        if (Admin) {
            const adminEmail = "admin@saanjh.com";
            const existingAdmin = await Admin.findOne({ email: adminEmail });
            if (!existingAdmin) {
                const newAdmin = new Admin({
                    email: adminEmail,
                    password: adminSecPass
                });
                await newAdmin.save();
                console.log('Admin account created: admin@saanjh.com / admin123');
            } else {
                console.log('Admin account already exists.');
            }
        }

        console.log('Done mapping dummy users and admins.');
        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
seedUsers();
