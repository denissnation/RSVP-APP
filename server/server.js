const express = require('express');
const connectDb = require('./config/db');
const register = require('./routes/register')
const auth = require('./routes/auth')
const guests = require('./routes/guests')


const app = express();

app.use(express.json())

app.use('/register', register)
app.use('/auth', auth)
app.use('/guest', guests)

connectDb()

// app.get('/', (req,res) => {
//     res.send('Hello world')
// })

const port = 5000
app.listen(port, () => {console.log(`server run on port ${port}`);})