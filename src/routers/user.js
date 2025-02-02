const express = require('express')
const multer = require('multer')
// const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail,sendCancellationEmail} = require('../emails/accounts')
const router = new express.Router()

router.post('/users',async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth, async (req,res) => {
    try{
        //removing current token as we are logging out 
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll',auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users',auth,async (req,res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch (e) {
        res.status(500).send(e)
    }

})

router.get('/users/me',auth,async (req,res) => {
    res.send(req.user)

})

router.patch('/users/me',auth,async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Operation'})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])    //we dont know what properties user will update so we are making it generic
        await req.user.save()
        res.send(req.user)
    }catch (e) {
        res.status(400).send(e)
    }
}) 

router.delete('/users/me',auth, async (req,res) => {
    try{
        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        return res.status(500).send()
    }
})

const upload = multer({
    limits : {
        fileSize : 100000
    },
    fileFilter(req,file,cb) {
        //if(!(file.originalname.endsWith('.jpg') || file.originalname.endsWith('.jpeg') || file.originalname.endsWith('.png'))){
        //the above if statement can also be written as
        if(! file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error ('File extension must be jpg,jpeg,png'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {

    // const buffer = await sharp(req.file.buffer).resize({width : 250, height: 250}).png().toBuffer()
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => {                             //error handling
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar',auth, async (req,res) => {
    req.user.avatar = undefined
    req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req,res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type' , 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router