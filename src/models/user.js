const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email. Check for typos or try a differnt address.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.length < 8){
                throw new Error('Password must be greater than 8 characters!')
            }
        }
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User