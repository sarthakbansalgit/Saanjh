const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: false
    },
    message: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('message', MessageSchema);
module.exports = Message;
