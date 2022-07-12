const accounts = require('../bbdd');
const {v4: uuidv4} = require('uuid');
const { writeDataToFile } = require('../utils')


function findAll(){
    return new Promise((resolver, reject) => {
        resolver(accounts);
    });
};

function findById(){
    return new Promise((resolver, reject) => {
        const account = account.find((acc) => acc.id === id)
        resolver(account)
    });
};


function create(account){
    return new Promise((resolve, reject) => {
        const newAccount = {id: uuidv4(), ...account}
        accounts.push(newAccount)
        writeDataToFile('../bbdd.json', accounts)
        resolve(newAccount);
    });
}


module.exports = {
    findAll,
    findById,
    create
};