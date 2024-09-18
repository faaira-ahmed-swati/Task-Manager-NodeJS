//all code that we want to access in our tests is written in fixtures directory so it can be accessed by all tests

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id:userOneId,
    name:'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens:[{
        token: jwt.sign({_id:userOneId} , process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id:userTwoId,
    name:'Andrew',
    email: 'andrew@example.com',
    password: 'myhouse099@@',
    tokens:[{
        token: jwt.sign({_id:userTwoId} , process.env.JWT_SECRET)
    }]
}


const task1 = {
    _id : new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id
}

const task2 = {
    _id : new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}

const task3 = {
    _id : new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
}

const task4 = {
    _id : new mongoose.Types.ObjectId(),
    description: 'Fourth task',
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await Task.deleteMany()
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
    await new Task(task4).save()
}

module.exports = {
    userOneId, 
    userOne,
    userTwo,
    userTwoId,
    task1,
    task2,
    task3,
    task4,   
    setupDatabase
}