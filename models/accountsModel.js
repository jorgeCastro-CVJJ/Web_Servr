let accounts = require('../bbdd');
const {v4: uuidv4} = require('uuid');
const { writeDataToFile, writeDataLog, writeBodyToLog } = require('../utils')


function findAll(){
    return new Promise((resolver, reject) => {
        resolver(accounts);
    });
};

function findById(id){
    return new Promise((resolver, reject) => {
        const account = accounts.find((acc) => acc.id === id)
        resolver(account)
    });
};


function create(account){
    return new Promise((resolve, reject) => {
        const newAccount = {id: uuidv4(), ...account}
        accounts.push(newAccount)
        writeDataToFile('./bbdd.json', accounts)
        resolve(newAccount)
    })
}

function accountToLog(account){
    return new Promise((resolve, reject) => {
        const newAccount = {id: uuidv4(), ...account}
        writeBodyToLog('./log_web.log', account)
        resolve(newAccount)
    })
}

function dataLog(content){
    return new Promise((resolve, reject) => {
        writeDataLog('./log_web.log', content)
        resolve(content)
    })
}

function remove(id){
    return new Promise((resolve, reject) => {
        accounts = accounts.filter((acc) => acc.id !== id)
        writeDataToFile('./bbdd.json', accounts)
        resolve()
    })
}

module.exports = {
    findAll,
    findById,
    create,
    dataLog,
    accountToLog,
    remove
};