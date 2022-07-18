const http = require('http');
const { getAccounts, getAccount, createAccount} = require('./controllers/accountsController')

const PORT  = 8080;
const  fs  = require('fs');
const { dataLog } = require('./models/accountsModel');
const { getPostData } = require('./utils');
const { info, trace } = require('console');

// timestamp
const dateObject = new Date();
    const date = (`0 ${dateObject.getDate()}`).slice(-2);
    const month = (`0 ${dateObject.getMonth() + 1}`).slice(-2);
    const year = dateObject.getFullYear();
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    let seconds = dateObject.getSeconds();
const timestamp = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;


var server = http.createServer((req, res) => {
    
    function logs(){
        fs.appendFileSync('./log_web.txt',"Requested Method: " +req.method + 
        " | URL: " + req.url + " | Date: "+ timestamp + "\n")
        }

    if(req.url ==='/api/accounts' && req.method === 'GET'){
        getAccounts(req, res)
        //logs()
        dataLog("Requested Method: " +req.method + 
        " | URL: " + req.url + " | Date: "+ timestamp + "\n")

    } else if(req.url.match(/\/api\/account\/([0-9]+)/) && req.method === 'GET'){
        const id = req.url.split('/')[3];
        getAccount(req, res, id);
        //logs();
        dataLog("Requested Method: " +req.method + 
        " | URL: " + req.url + " | Date: "+ timestamp + "\n")

    } else if(req.url === '/api/accounts/create' && req.method === 'POST'){
        createAccount(req,res)

        dataLog("Requested Method: " +req.method + 
        " | URL: " + req.url + " | Date: "+ timestamp + "\n")

    } else {
        res.writeHead(404,{'Content-Type': 'application/json' })
        res.end(JSON.stringify({message: 'Route Not Found'}))
        //logs();
        dataLog("Requested Method: " +req.method + 
        " | URL: " + req.url + " | Date: "+ timestamp + "\n")
    }
});

server.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`)
});

