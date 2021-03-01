const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth');

// register new users to database
router.post('/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
})

// log in existing users
router.post('/signin', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        res.status(400).send({error: err.message});
    }
})

// logout user from current device
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send()
    }
})

// logout user from all devices they've used
router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send()
    }
})

// test route
router.post('/test', auth, async (req, res) => {
    res.send('i am authenticated')
})

module.exports = router