const mongoose = require ('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true
    },
    age : {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },
    password : {
        type: String,
        required : true,
        trim : true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens : [{
        token : {
            type: String, 
            required: true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
    timestamps : true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

module.exports = userSchema