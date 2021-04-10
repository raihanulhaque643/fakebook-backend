const express = require('express');
const router = new express.Router();
const Opinion = require('../models/opinion');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer')
const sharp = require('sharp')

// post an opinion
router.post('/opinions', auth, async (req, res) => {
    const opinion = new Opinion({
        ...req.body,
        owner: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName
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
                sort: {
                    'updatedAt': -1
                }
            }
        }).execPopulate()
        res.send(req.user.opinions);
    } catch (e) {
        res.status(500).send({e});
    }
})

// get an opinion
router.get('/myopinions/:id',auth, async (req, res) => {
    try {
        const opinion = await Opinion.findById(req.params.id);

        if (!opinion || !opinion.opinionImage) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png');
        res.send(opinion);
    } catch (e) {
        res.status(404).send()
    }
})

// get all opinions of all users
router.get('/allOpinions', auth, async (req, res) => {
    try {
        const opinions = await Opinion.find({}).sort( { updatedAt: -1 } )
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        if(!opinions) {
            return res.status(200).send('No opinions')
        }
        res.send(opinions)
    } catch (e) {
        res.status(500).send({e});
    }
})

// update an opinion
router.patch('/opinion/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    const _id = req.params.id;
    try {
        const opinion = await Opinion.findOne({ _id: req.params.id, owner: req.user._id })
        
        if (!opinion) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            opinion[update] = req.body[update]
        })
        await opinion.save();
        res.send(opinion);
    } catch (e) {
        res.status(400).send(e);
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

// agree to an opinion
router.patch('/opinion/agree/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const opinion = await Opinion.findOne({ _id: req.params.id })
        
        if (!opinion) {
            return res.status(404).send();
        }

        // const _userId = req.body.userId;
        const _userId = req.user._id;
        if(opinion.agree.includes(_userId)) {
            return
        } else if(opinion.disagree.includes(_userId)) {
            opinion.disagree.filter(item => item === _userId )
            opinion.agree.unshift(_userId)
        } else {
            opinion.agree.unshift(_userId)
        }

        await opinion.save();
        res.send(opinion);
    } catch (e) {
        res.status(400).send(e);
    }   
})

// disagree to an opinion
router.patch('/opinion/disagree/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const opinion = await Opinion.findOne({ _id: req.params.id })
        
        if (!opinion) {
            return res.status(404).send();
        }

        const _userId = req.body.userId;
        if(opinion.disagree.includes(_userId)) {
            return
        } else if(opinion.agree.includes(_userId)) {
            agree.filter(item => item ===_userId )
            disagree.unshift(_userId)
        } else {
            disagree.unshift(_userId)
        }
        
        await opinion.save();
        res.send(opinion);
    } catch (e) {
        res.status(400).send(e);
    }   
})

// // create multer instance
// const upload = multer({
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload an image!'))
//         }

//         cb(undefined, true);
//     }
// })

// // post an opinion with image (multi-part form)
// // req.body will contain text fields and req.file will have time image file
// router.post('/opinions/me', auth, async (req, res) => {
//     const opinion = new Opinion({
//         ...req.body,
//         owner: req.user._id
//     })
//     try {
//         await opinion.save();
//         res.status(201).send(opinion)
//     } catch (e) {
//         res.status(400).send(e);
//     }
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// // get opinion image
// router.get('/opinions/:id/opinionImage', async (req, res) => {
//     try {
//         const opinion = await Opinion.findById(req.params.id);

//         if (!opinion || !opinion.opinionImage) {
//             throw new Error()
//         }

//         res.set('Content-Type', 'image/png');
//         res.set('Access-Control-Allow-Origin', '*')
//         res.send(opinion.opinionImage);
//     } catch (e) {
//         res.status(404).send()
//     }
// })

module.exports = router