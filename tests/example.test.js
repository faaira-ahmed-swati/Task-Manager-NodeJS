const add = (a,b) => {
    return new Promise((resolve,reject) => {
        setTimeout( () => {
            resolve(a+b)
        },2000)
    })
}

test('Should add two numbers', (done) => {
    add(2,3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Should add two numbers async/await', async () => {
   const sum = await add(10,22)
   expect(sum).toBe(32)
})
