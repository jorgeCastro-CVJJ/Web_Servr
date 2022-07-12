const Account = require('../models/accountsModel');


// @desc    GET all accounts
// @route   GET /api/accounts
async function getAccounts(req, res){
    try{
        const accounts = await Account.findAll()

        res.writeHead(200, { 'Content-Type':'application/json' })
        res.end(JSON.stringify(accounts));
    } catch (err){
        console.log(error);
    }
}

// @desc    GET one account
// @route   GET /api/account/:id
async function getAccount(req, res, id){
    try{
        const account = await Account.findById()

        if(!account) {
            res.writeHead(404, { 'Content-Type':'application/json' })
            res.end(JSON.stringify({ message: 'Account Not Found'}));
        } else {
            res.writeHead(200, { 'Content-Type':'application/json' })
            res.end(JSON.stringify(account));
        }
        
    } catch (err){
        console.log(error);
    }
}


// @desc    Create an account
// @route   POST /api/accounts
async function createAccount(req, res){
    try{
        const account = {
            name: 'Jose Pablo Test',
            isActive: true,
            balance: "$3,546.20",
            age: 30,
            eyeColor: "green",
            company: "DOGNOSIS",
            email: "pauletteirwin@dognosis.com",
            phone: "+1 (868) 401-2949",
            address: "912 Morton Street, Brutus, New Mexico, 9560",
            registered: "2019-04-30T02:37:23 +05:00"
        }
        
        const newAccount = await Account.create(account);
        res.writeHead(201, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify(newAccount));

    } catch (err){
        console.log(error);
    }
}



module.exports = {
    getAccounts,
    getAccount,
    createAccount
}