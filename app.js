const express = require('express')
const app = express()
const port = 3000
const User = require('./models/user')
const path = require('path')
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const session = require('express-session')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/users', {})
.then(() => { console.log('Mongoose Connected!')})
.catch(() => { console.log('Mongo Error')})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(session({secret: 'notagoodsecret', resave: false, saveUninitialized: true}))

const requireLogin = (req,res,next) => {
    if(!req.session.user_id){
        return res.redirect('/login')
    } else {
        next()
    }
}

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
    if(!req.session.user_id){
        res.redirect('/login')
    } else{
        res.render('secret')
    }
})

app.get('/topsecret', requireLogin, (req,res) => {
    res.send('Top Secret')
})

app.get('/secret', requireLogin, (req,res) => {
        res.render('secret')
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body
    const user = await User.findAndValidate(username, password)

    if(user){
        req.session.user_id = user._id;
        res.redirect('/admin')
    } else {
        res.redirect('/login')
    }
})

app.post('/register', async (req, res) => {
    const pw = req.body.password
    const hash = await bcrypt.hash(pw,12)
    const {username} = req.body
    const user = await new User({username, password: hash})
    console.log(user)
    await user.save()
    req.session.user_id = user._id;
    res.redirect('/login')
})

app.post('/logout', (req,res) => {
    req.session.user_id = null
    res.redirect('/login')
})

app.listen(port, () => { console.log(`listening on port ${port}`)})




