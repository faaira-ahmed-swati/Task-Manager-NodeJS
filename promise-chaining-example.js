require('./src/db/mongoose')
const Task = require('./src/models/task')

Task.findByIdAndDelete('640354feff450558d44b2822').then((task) => {
    console.log(task)
    return Task.countDocuments({completed : false})
}).then((res) => {
    console.log(res)
}).catch((e) => {
    console.log(e)
})

//using async await
const deleteTaskAndCount = async (id,completed) => {
    const task = await User.findByIdAndDelete(id)
    const count = await User.countDocuments({completed})
    return count
}

deleteTaskAndCount('640348a87bfb485dd491347a',false).then((res) => {
    console.log(res)
}).catch((e) => {
    console.log(e)
})