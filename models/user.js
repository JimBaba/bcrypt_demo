const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    username: {type : String, required: [true, 'Username can not be blank']},
    password: {type: String, required: [true, 'Must choose a Password']}

})

userSchema.statics.findAndValidate = async function(username, password){
    const user = await this.findOne({username})
    const hash = user.password
    const isValid = await bcrypt.compare(password, hash)
    return isValid ? user : false
}

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,12)
    next()
})

module.exports = mongoose.model('User', userSchema)