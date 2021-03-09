const mongoose = require('mongoose');

const opinionSchema = new mongoose.Schema({
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

// remove password before returning json data to client
opinionSchema.methods.toJSON = function () {
    const opinion = this;
    const opinionObject = opinion.toObject()

    delete opinionObject.opinionImage;
    return opinionObject;
}

const Opinion = mongoose.model('Opinion', opinionSchema);

module.exports = Opinion;