const request = require('supertest')
const { response } = require('../src/app')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId,userOne,userTwo,task1,setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description : 'from my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should not create task with invalid description', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed : '123'
        })
        .expect(400)
})

test('Should update task for user', async () => {
    await request(app)
        .patch('/tasks/' + task1._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description : 'updating my test'
        })
        .expect(200)
})

test('Should update task with invalid details', async () => {
    await request(app)
        .patch('/tasks/' + task1._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location : 'USA'
        })
        .expect(400)
})

test('Get tasks for a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toEqual(2)
})

test('Delete task for authorized user', async () => {
    await request(app)
        .delete('/tasks/' + task1._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)    
})

test('Delete task for unauthorized user', async () => {
    const response = await request(app)
        .delete('/tasks/' + task1._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull()
})

test('Should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks/?completed=true')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toEqual(1)
})