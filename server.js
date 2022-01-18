const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { ok } = require('assert')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const JWT_SECRET = 'jdssjgbbksdfkfjhhdshsdgkjjkhdfhdfshklhgjksdfjkfhjfgh535jj5j4jk45j'
mongoose.connect('mongodb+srv://puja_99:YnbJCTunmIUfrJDT@cluster0.dd05a.mongodb.net/User?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).then(()=>{
    console.log("connected to db");
})

const app = express()

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/login', async (req, res)=>{
    const email = req.body.email

    const user = await User.findOne({ email }).lean()

    if(!user){
        return res.json({ status:'error', error:'Invalid email password' })
    }

    if(await bcrypt.compare(req.body.password, user.password)){
        //email password combination successfull
        const token = jwt.sign({ 
            id: user._id, 
            email: user.email 
        }, JWT_SECRET
        )

        return res.json({ status:'ok', data: token })
    }

    return res.json({ status:'error', error:'Invalid email password' })
})

app.post('/api/register', async (req, res)=>{
    // console.log(req.body)

    const {email, password: plainTextPassword} = req.body
    console.log(email);
    const password = await bcrypt.hash(plainTextPassword, 10)
    console.log(password)

    try{
        const responce = await User.create({
            email,
            password
        })
    }catch(error){
        console.log(error)
        return res.json({status: 'error'})
    }

    res.json({status: 'ok'})
})

app.listen(8000, ()=>{
    console.log('listening')
})