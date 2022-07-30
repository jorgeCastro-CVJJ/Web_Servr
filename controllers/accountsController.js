const Account = require('../models/accountsModel');
const { getPostData, writeDataLog } = require('../utils')

// @desc    GET all accounts
// @route   GET /api/accounts
async function getAccounts(req, res){
    try{
        const accounts = await Account.findAll()

        res.writeHead(200, { 'Content-Type':'application/json' })
        res.end(JSON.stringify(accounts));
    } catch (err){
        console.log(err);
    }
}

// @desc    GET one account
// @route   GET /api/account/:id {:id refers whatever number }
async function getAccount(req, res, id){
    try{
        const account = await Account.findById(id)

        if(!account) {
            res.writeHead(404, { 'Content-Type':'application/json' })
            res.end(JSON.stringify({ message: 'Account Not Found'}));
        } else {
            res.writeHead(200, { 'Content-Type':'application/json' })
            res.end(JSON.stringify(account));
        }
        
    } catch (err){
        console.log(err);
    }
}


// @desc    Create an account
// @route   POST /api/accounts
async function createAccount(req, res){
    try{
        const body = await getPostData(req)

        const {name, isActive,
            balance, age,
            eyeColor, company,
            email, phone,
            address, registered} = JSON.parse(body)

        const account = {
            name, isActive,
            balance, age,
            eyeColor, company,
            email, phone,
            address, registered
        }
        const newAccount = await Account.create(account)
        const bodyLog = await Account.accountToLog(account)

        res.writeHead(201, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify(newAccount))

    } catch (err){
        console.log(err);
    }
}

// @desc    DELETE single account
// @route   DELETE /api/account/:id
async function deleteAccount(req, res, id){
    try{
        const account = await Account.findById(id)

        if(!account) {
            res.writeHead(404, { 'Content-Type':'application/json' })
            res.end(JSON.stringify({ message: 'Account Not Found'}));
        } else {
            await Account.remove(id);
            res.writeHead(200, { 'Content-Type':'application/json' })
            res.end(JSON.stringify({message:`Account ${id} removed `}));
        }
    } catch (err){
        console.log(err);
    }
}

module.exports = {
    getAccounts,
    getAccount,
    createAccount,
    deleteAccount
}