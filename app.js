const express = require('express')
const app = express()
const port = 3000
const User = require('./models/user')
const path = require('path')
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/users', {})
.then(() => { console.log('Mongoose Connected!')})
.catch(() => { console.log('Mongo Error')})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('HOMEPAGE')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/admin', (req, res) => {
    res.send('Admin authorized!')
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username: username})
    if(!user){
        res.send('Username or Password incorrect')
    }
    const hash = user.password
    const isCorrect = await bcrypt.compare(password, hash)
    if(isCorrect){
        res.send('Logged In')
    } else {
        res.send('Username or Password incorrect')
    }
})

app.post('/register', async (req, res) => {
    const pw = req.body.password
    const hash = await bcrypt.hash(pw,12)
    const {username} = req.body
    const user = await new User({username, password: hash})
    console.log(user)
    await user.save()
    res.redirect('/')
})

app.listen(port, () => { console.log(`listening on port ${port}`)})




