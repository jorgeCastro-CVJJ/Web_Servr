const http = require('http');
const { getAccounts, getAcount, createAccount} = require('./controllers/accountsController')

const PORT  = 3000;
const infoAcc = require('./bbdd');
const { dataLog } = require('./models/accountsModel');
const  fs  = require('fs');

// timestamp
const dateObject = new Date();
    const date = (`0 ${dateObject.getDate()}`).slice(-2);
    const month = (`0 ${dateObject.getMonth() + 1}`).slice(-2);
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
const timestamp = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

/*function Log(){
    fs.appendFileSync('./log_web.txt',"\n" +req.method + " " + req.url + " "+ timestamp + "\n")
}*/


var server = http.createServer((req, res) => {
    if(req.url ==='/api/accounts' && req.method === 'GET'){
        res.writeHead(200,{'Content-Type': 'application/json' })
        res.end(JSON.stringify(infoAcc))
        fs.appendFileSync('./log_web.txt',"\n" +req.method + " " + req.url + " "+ timestamp + "\n")

    } else if(req.url.match(/\/api\/account\/([0-9]+)/) && req.method === 'GET'){
        const id = req.url.split('/')[3];
        getAccounts(req, res, id);
        //Log();
        fs.appendFileSync('./log_web.txt',"\n" +req.method + " " + req.url + " "+ timestamp + "\n")
        

    } else if(req.url === '/api/accounts' && req.method === 'POST'){
        createAccount(req,res);
        //Log();
        fs.appendFileSync('./log_web.txt',"\n" +req.method + " " + req.url + " "+ timestamp + "\n")

        

    } else {
        res.writeHead(404,{'Content-Type': 'application/json' })
        res.end(JSON.stringify({message: 'Route Not Found'}))
    }
});

server.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`)
});

