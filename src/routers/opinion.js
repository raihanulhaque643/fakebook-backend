const express = require('express');
const router = new express.Router();
const Opinion = require('../models/opinion');
const User = require('../models/user');
const auth = require('../middleware/auth');

// user can post their opinion
router.post('/opinions', auth, async (req, res) => {
    const opinion = new Opinion({
        ...req.body,
        owner: req.user._id
    })
    try {
        await opinion.save();
        res.status(201).send(opinion)
    } catch (e) {
        res.status(400).send(e);
    }
})

// get all opinions of logged in user
router.get('/myOpinions', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'opinions',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
            }
        }).execPopulate()
        res.send(req.user.opinions);
    } catch (e) {
        res.status(500).send();
    }
})

// get all opinions of all users
router.get('/allOpinions', auth, async (req, res) => {
    try {
        const opinions = await Opinion.find({})
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        if(!opinions) {
            return res.status(200).send('No opinions')
        }
        res.send(opinions)
    } catch (e) {
        res.status(500).send();
    }
})

// delete user's own opinion
router.delete('/opinions/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const opinion = await Opinion.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!opinion) {
            return res.status(404).send()
        }
        res.send(opinion);
    } catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router