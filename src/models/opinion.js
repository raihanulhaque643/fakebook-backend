const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    opinionImage: {
        type: Buffer
    },
    agree: [
        {
            user: String,
            date: Date
        }
    ],
    disagree: [
        {
            user: String,
            date: Date
        }
    ],
    comments: [
        {
            author: String,
            body: String,
            date: Date
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Opinion'
    }
}, {
    timestamps: true
});

const Opinion = mongoose.model('Opinion', taskSchema);

module.exports = Opinion;