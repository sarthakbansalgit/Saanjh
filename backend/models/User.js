const mongoose = require('mongoose');

const { Schema } = mongoose;



const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number
  },
  caste: {
    type: String

  },
  dob: {
    type: String
  },
  state: {
    type: String
  },
  district: {
    type: String
  },
  height: {
    type: String
  },
  weight: {
    type: String
  },

  education: {
    type: String
  },
  working: {
    type: String
  },


  password: {
    type: String,
    required: true
  },
  description: {
    type: String
  },


  gender: {
    type: String,
    required: true
  },
  otp: {
    type: Number
  },
  image: {
    type: String
  },

  // Phase 1 Additional Fields
  religion: { type: String, default: "Not Specified" },
  motherTongue: { type: String, default: "Not Specified" },

  // Phase 3 Additional Fields
  maritalStatus: { type: String, default: "Never Married" },
  partnerPreference: { type: String },

  // Admin & Security Fields
  status: { type: String, default: "approved", enum: ["pending", "approved", "blocked"] },  // For Admin Moderation

  // Membership & Payment
  plan: { type: String, default: "free", enum: ["free", "7days", "1month", "6months"] },
  planExpiry: { type: Date },

  // Match & Interest System
  interestsSent: [{ type: String }],      // Array of emails
  interestsReceived: [{ type: String }],  // Array of emails
  matches: [{ type: String }],            // Array of emails (Mutual Matches)

  // Daily Tracking Limits
  dailyViews: {
    date: { type: String },
    count: { type: Number, default: 0 }
  },

  date: {
    type: Date,
    default: Date.now
  }

});




const User = mongoose.model('user', UserSchema);
module.exports = User;