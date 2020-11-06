const express = require('express')
const auth = require('../middleware/auth')
const Guest = require('../models/guest')
const router = express.Router()
const {check, validationResult} = require('express-validator')

router.get('/', auth,async (req, res, next) => {
    try {
        const guest = await Guest.find({user: req.user.id})
        if (!guest) {
            return res.status(400).json({message: 'No guest Found'})
        }

        res.status(200).json(guest)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
})

router.post('/', auth, [
    check('name', 'Please Provide a name').not().isEmpty(),
    check('phone', 'Please Provide a phone number').not().isEmpty()
], async(req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()})
    }
    const {users,name, phone, diet, isconfirmed} = req.body
    try {
        guest = new Guest({
            user: req.user.id,
            name,
            phone,
            diet,
            isconfirmed
        })

        await guest.save()

        res.status(201).send(guest)
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error')
    }
})

router.put('/:id', auth, async (req, res, next) => {
    const {name, phone, diet, isconfirmed} = req.body
    const updateFields = {name, phone, diet, isconfirmed}

    try {
        let guest = await Guest.findById(req.params.id)
        if (!guest) return res.status(404).json({ message: 'Guest not found' })
        // Make sure user owns the guest
        if (guest.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorised' })
        }
        guest = await Guest.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true })
        res.send(guest)
    } catch (err) {
        console.errors(err.message)
        res.status(500).send('Server Error')
    }

    // try {
    //     let guest = await Guest.findOne({_id: req.params.id, user: req.user.id})

    //     if (!guest) {
    //         return res.status(400).send('No guest Found')
    //     }

    //     await guest.updateOne({_id: req.params.id},{$set: updateFields},{new: true})
    //     await guest.save
    //     res.send(guest1)    
    // } catch (error) {
    //     console.errors(err.message)
    //     res.status(500).send('Server Error')
    // }

    
})

router.delete('/:id', auth,async (req,res,next) => {
    try {
        const guest = await Guest.findOne({_id: req.params.id, user: req.user.id})
        console.log(guest);
        if (!guest) {
            return res.status(400).json({message: 'No guest found'})
        }

        await guest.remove()
        res.status(201).json({message: 'Guest Removed'})
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }
})

module.exports = router