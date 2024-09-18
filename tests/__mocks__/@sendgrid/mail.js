/*we don't want to send emails for signup and delete account everytime we are testing our application 
so what we do instead is that we create a mock folder and inside it with the name of the module we are importing 
that is @sendgrid/mail. we will export two functions that we are using in the emails/accounts.js and we wont write any
functionality and as those functions dont return anything so these wont also*/
module.exports = {
    setApiKey(){

    },
    send(){

    }
}