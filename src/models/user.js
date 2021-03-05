const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const beautifyUnique = require('mongoose-beautiful-unique-validation')

// user data schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: 'Email already registered to a user.',
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
        required: true,
        validate(value) {
            if (value.length !== 11) {
                throw new Error('Invalid phone number. Phone number must be 11 digits.')
            }
        }
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

userSchema.virtual('opinions', {
    ref: 'Opinion',
    localField: '_id',
    foreignField: 'owner'
})

// remove password before returning json data to client
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()

    delete userObject.password;
    return userObject;
}

// look for registered user & check for correct password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('User account does not exist!')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Incorrect password!')
    }

    return user;
}

// create auth token and assign to user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();

})

userSchema.plugin(beautifyUnique); //to expand mognoose error codes into meaningful messages

const User = mongoose.model('User', userSchema)

module.exports = User