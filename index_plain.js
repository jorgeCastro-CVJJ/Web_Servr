const http = require('http');
const { getAccounts, getAcount, createAccount} = require('./controllers/accountsController')

const PORT  = 3000;
const infoAcc = require('./bbdd')

var server = http.createServer((req, res) => {
    if(req.url ==='/api/accounts' && req.method === 'GET'){
        res.writeHead(200,{'Content-Type': 'application/json' })
        res.end(JSON.stringify(infoAcc))

    } else if(req.url.match(/\/api\/account\/([0-9]+)/) && req.method === 'GET'){
        const id = req.url.split('/')[3];
        getAccounts(req, res, id);

    } else if(req.url === '/api/accounts' && req.method === 'POST'){
        createAccount(req,res);

        

    } else {
        res.writeHead(404,{'Content-Type': 'application/json' })
        res.end(JSON.stringify({message: 'Route Not Found'}))
    }
});

server.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`)
});

