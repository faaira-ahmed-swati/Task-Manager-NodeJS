const mongoose = require ('mongoose')
const userSchema = require('../schema/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

//when res.send is called it calls JSON.stringify which calls toJSON in which we are manipulating the things we want to send back
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//Hash the plain text passsword before saving
userSchema.pre('save',async function (next) {
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

//Delete user task when user is removed
userSchema.pre('remove',async function (next) {
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User