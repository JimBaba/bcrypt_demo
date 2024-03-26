const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type : String, required: [true, 'Username can not be blank']},
    password: {type: String, required: [true, 'Must choose a Password']}
})

module.exports = mongoose.model('User', userSchema)