const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userOne,setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup new user', async() => {
    await request(app)
        .post('/users')
        .send({
            name: 'Faaira',
            email: 'faaira@example.com',
            password: 'MyPass777!'
        })
        .expect(201)
})

test('Should login existing user', async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'invalidpass'
        })
        .expect(400)
    
})

test('Should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete profile for authenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete profile for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/dog.jpeg')                 //to attach the image file
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))         //expect.any to check the type of data stored 
                                                            //we can also do expect.any(Number) to check for a number

    //SIDE NOTES
    //toBe uses === and compares the values it doesnt compare objects
    //to compare properties on the objects we use toEqual
})

test('Should update user', async() => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name:'Affan pagal'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.name).toBe(user.name)
})
test('Should update user', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location : "Pakistan"
        })
        .expect(400)
})


