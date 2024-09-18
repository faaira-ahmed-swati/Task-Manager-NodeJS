
const {MongoClient,ObjectID} = require('mongodb')
const url = 'mongodb://127.0.0.1:27017';

const dbName = 'task-manager';
const client = new MongoClient(url);

client.connect((error) => {
    if (error){
        return console.log('Unable to connect to database!')
    }
    const db = client.db(dbName);


    db.collection('tasks').updateMany({
        completed : false
    },{
        $set : {
            completed : true
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
     
});
 