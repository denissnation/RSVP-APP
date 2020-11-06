const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const Users = require('../models/user')
const jwt = require('jsonwebtoken')

router.post('/',
[
    check('name', 'Please Provide a name').not().isEmpty(),
    check('email', 'Please Provide a valid email').isEmail(),
    check('password', 'Please provide a 6 character password').isLength({min: 6})
], 
async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()})
        
    }
    const {name, email, password} = req.body
    try {
        let user = await Users.findOne({email})
        if (user) {
            return res.status(400).json({message: 'User already Exist'})
        }
        user = new Users({
            name,
            email,
            password
        })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()

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