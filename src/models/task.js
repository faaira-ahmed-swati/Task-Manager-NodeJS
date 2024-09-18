const mongoose = require ('mongoose')
const taskSchema = require('../schema/task')

const Task = mongoose.model('Task',taskSchema)

module.exports = Task