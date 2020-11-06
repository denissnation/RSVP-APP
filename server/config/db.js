const mongoose = require('mongoose')

require('dotenv').config()

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        })
        console.log('Connect to mongoDb Success');    
    } catch (error) {
        console.log(error.message);
    }
    
}

module.exports = connectDb