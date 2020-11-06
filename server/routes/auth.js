const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const Users = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

router.get('/',auth, async (req, res, next)=> {
    try {
        const user = await Users.findById(req.user.id).select("-password")
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")
    }
})

router.post('/',
[
    check('email', 'Please Provide a valid email').isEmail(),
    check('password', 'Please provide a 6 character password').exists()
], 
async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()})
        
    }
    const { email, password} = req.body
    try {
        let user = await Users.findOne({email})
        if (!user) {
            return res.status(400).json({message: 'Invalid Credential'})
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({message: 'Invalid Credential'})
        }
        
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error
            res.send({token})
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
    
    
})

module.exports = router