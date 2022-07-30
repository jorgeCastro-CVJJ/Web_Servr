const http = require('http');
const { getAccounts, getAccount, createAccount, deleteAccount} = require('./controllers/accountsController')

const PORT  = 80;
const  fs  = require('fs');
const { dataLog } = require('./models/accountsModel');
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
    
    // Need to add mimetypes for ANY request -> Dictionary ig.
    // log 404 pages when path is OK but id is not existant?
    function logs(){
        var ip = req.socket.remoteAddress;
        ip = ip.split(':').slice(-1); 
        fs.appendFileSync('./log_web.log',`\n${timestamp} | ${req.method} ${req.url} | IP: ${ip}`)
        }

    if(req.url ==='/api/accounts' && req.method === 'GET'){
        getAccounts(req, res)
        logs()
        

    } else if(req.url.match(/\/api\/account\/([0-9]+)/) && req.method === 'GET'){
        const id = req.url.split('/')[3];
        getAccount(req, res, id);
        logs();
        

    } else if(req.url === '/api/accounts/create' && req.method === 'POST'){
        
        ///===============================================================================///
        var ip = req.socket.remoteAddress;
        ip = ip.split(':').slice(-1); 
        dataLog(`\n${timestamp} | ${req.method} ${req.url} | IP: ${ip}\nBody:\n`)
        ///===============================================================================///
        
        createAccount(req,res)
        

    } /*else if(req.url === '/api/accounts/create' && req.method === 'POST'){

    }*/else if(req.url.match(/\/api\/account\/([0-9]+)/) && req.method === 'DELETE'){
        const id = req.url.split('/')[3];
        deleteAccount(req, res, id);
        logs();
        

    }else {
        res.writeHead(404,{'Content-Type': 'text/html' })
        res.end("404 | Page Not Found")
        logs();
    }
});

server.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`)
});

