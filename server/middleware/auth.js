const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const auth = async (req, res, next) => {
    try {
        const token = await req.header('auth-token')
        if (!token) {
            res.statu(401).json({message:'No token, access denied'})
        }
        const decode = await jwt.verify(token, process.env.SECRET)
        req.user = decode.user
        next()
    } catch (error) {
        res.status(401).json({message: 'Invalid Token'})
    }
}

module.exports = auth

