const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

 
/* without async await */
// router.post('/users',(req,res) => {
//     const user = new User(req.body)
//     user.save().then((user) => {
//         res.send(user)
//     }).catch((error) => {
//         res.status(400).send(error)
//     })
// })

/* using async await*/
router.post('/users',async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
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

/*this route doesnt make sense any longer as we already have the above route to get user with id which is 
we can only have access to our data we can't call for other users*/
router.get('/users/:id',async (req,res) => {

    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(400).send()
        }
        res.send(user)
    }catch (e) {
        res.status(500).send(e)
    }
}) 

router.patch('/users/:id',auth,async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Operation'})
    }

    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])    //we dont know what properties user will update so we are making it generic
        await user.save()

        /* do above instead of this to make our middleware work */
        // const user = await User.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch (e) {
        res.status(400).send(e)
    }
}) 


router.delete('/users/:id', async (req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        return res.status(500).send()
    }
})

module.exports = router