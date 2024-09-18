/* to run paste the below code in user.js*/
const upload = multer({
    dest : 'images',
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

router.post('/users/me/avatar', auth, upload.single('avatar'), (req,res) => {
    res.send()
},(error,req,res,next) => {                             //error handling
    res.status(400).send({error : error.message})
})