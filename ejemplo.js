/*No me deja adjuntar, te lo pego aca.

Muchas funciones no van a correr pero se las deje para que te des una idea.

Pon atencion a la parte de....

    if (request.method === 'GET') 

Puedes hacer algo como ....

    if (request.method === 'GET') {
        // loggear req, timestamp y url/path
    } else if (request.method === 'POST') {
        // loggear req, timestamp, url/path y body del post
    } else {
        // loggear req, timestamp y url/path
    }

//////////////////////////////////////////////*/
//import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
//import * as util from 'util';
import { fork } from 'child_process';
//import { exec  } from 'child_process';


/*var http = require('http');
var https = require('https');
var fs   = require('fs');
var path = require('path');
//var util = require('util');
var fork = require('child_process').fork;
//var exec = require('child_process').exec;

*/

var https_options = {
key: fs.readFileSync("./key.pem").toString(),
cert: fs.readFileSync("./35086306f2861353.crt", "utf-8"),
};

https.createServer(function (request, response) {

    var filePath = request.url.split('?')[0];
    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        ''   : 'text/html',
        '/'   : 'text/html',
        '.html': 'text/html',
        '.htm' : 'text/html',
        '.js'  : 'text/javascript',
        '.css' : 'text/css',
        '.json': 'application/json',
        '.png' : 'image/png',
        '.ico' : 'image/png',
        '.jpg' : 'image/jpg',
        '.gif' : 'image/gif',
        '.svg' : 'image/svg+xml',
        '.wav' : 'audio/wav',
        '.mp4' : 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf' : 'application/font-ttf',
        '.eot' : 'application/vnd.ms-fontobject',
        '.otf' : 'application/font-otf',
        '.wasm': 'application/wasm',
        '.pdf': 'application/pdf'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';
    var routes = {
    "static" : {
    "/favicon.ico" : "./favicon.ico"
    },
    "executable" : {
"/"   : "./assets/KIT_Consulting/CONTROLLERS/GETrequestController.js"
    },
    "downloadable" : {
    "/file1.txt" : "./assets/downloadable/1.txt"
    }
    };

    var resource = routes['static'][request.url.split('?')[0]] || routes['executable'][request.url.split('?')[0]] || routes['downloadable'][request.url.split('?')[0]];

    var resourceType = undefined;

    Object.keys(routes).forEach(key => {
if(routes[key][request.url.split('?')[0]] !== undefined){
    resourceType = key;
    };
    });


    if (request.method === 'GET') {
    console.log('requested resource ' + resource);
if(resource === undefined){//no route for resource; 404
//no route for resource
        response.writeHead(404, { 'Content-Type': 'text/html' });
        console.log('404 | ' + request.url);
fs.readFile('./assets/server/index.html', function(err, content) {
//el archivo de la pagina 404
response.write("<meta charset = 'utf-8'>")
if(err){
response.write("ERR: "+ err.code);
}
response.write("<br>REQUESTED: "+ request.url);
response.write(content, 'utf-8');
response.end();
            });
}else{
       fs.readFile('./' + resource, function(error, content) {
           if (error) {
               if(error.code == 'ENOENT' || 'EISDIR') {
                //It's an abbreviation of Error NO ENTry (or Error NO ENTity), and can actually be used for more than files/directories.
                   response.writeHead(404, { 'Content-Type': 'text/html' });
        console.log('404 | ' + request.url);
             fs.readFile('./assets/server/index.html', function(err, content) {
                       // response.write("<meta charset = 'utf-8'>");
                       response.write(error.code);
                       // response.write(routes[request.url]);
       
                       console.log("no entity " + filePath);
                       if(err){
                           response.write("ERR: "+ err.code);
                       }
                       response.write("<br>REQUESTED: "+ request.url);
                       response.write("<br>resource: "+ resource);
    response.write(content, 'utf-8');
    response.end();
               });
               } else {
                   response.writeHead(500);//generic error response
                   response.end('SITE ERROR: '+error.code+ ' \n');
                       response.end();
               }
           } else { //resource is routed

if(resourceType === undefined){
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end();//just serve routed resource
        } else if(resourceType === "executable"){
                response.writeHead(200, { 'Content-Type': contentType });
    // execute child here

    var controller = fork("./" + resource, {shell:false});
    // var controller = fork("./" + resource, [], {silent:true});
    console.log('forked resource ' + resource);

    var controllerRequest = {};
    controllerRequest.url    = request.url;
           controllerRequest.head   = request.headers;
           controllerRequest.cookie = request.headers.cookie;
           // controllerRequest.body   = content;//sanitize probably


           controller.send( JSON.stringify(controllerRequest));

           //timeout response end....

           controller.on("message", function (message) {
            if(typeof message === 'object'){
                var buffer = Buffer.from(message, "utf-8");
                response.end(buffer, 'binary');
            }else{
                response.end(message, 'binary');
            }

           });

        } else if(resourceType === "downloadable" || resourceType === "static"){
                response.writeHead(200, { 'Content-Type': contentType });
        console.log("resource type " + resourceType);
        response.end(content, 'binary');
        }

           }
       });
}

    } else if (request.method === 'POST') {

        console.log('POST REQUEST '+ request.url);
if(resource === undefined){//no route for resource; 404
            response.writeHead(404, { 'Content-Type': 'text/html' });
response.end();
        } else if (resourceType === "executable"){

       let body = '';
       request.on('data', chunk => {
           body += chunk.toString(); // convert Buffer to string
           // console.log(chunk);
       });
       request.on('end', () => {

        console.log("[ " + (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':') + " ] " + request.url);

           var child  = fork("./" + resource, {shell:false});
           var req    = {};
           req.url    = request.url;
           req.head   = request.headers;
           req.cookie = request.headers.cookie;
           req.body   = body +"";//sanitize probably
           
           child.send(JSON.stringify(req));
           child.on("message", function (message) {
            //refactor
              //send data to appropiate controller ->

               var responseStatus = {};
            if(JSON.parse(message).cookie){
            response.writeHead(200, { 'Content-Type': 'text/plain',
                'Set-Cookie'  :  JSON.parse(message).cookie + "; SameSite=Lax; HttpOnly"});
              }else{
                response.writeHead(200, { 'Content-Type': 'text/plain'});
              }
               responseStatus.success = JSON.parse(message).success;
               responseStatus.cause   = JSON.parse(message).cause;
                 // 'Set-Cookie'  : 'encrypted cookie' });

               response.end(JSON.stringify(responseStatus));
           });
       });
   }else{
            response.writeHead(404, { 'Content-Type': 'text/html' });
            console.log('resource type: ' + resourceType);
    response.end();
   }
    }

}).listen(8080);
console.log('Server running at http://127.0.0.1:8080/');


process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("[ " + (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':') + " ]");
    console.log("UNCAUGHT EXCEPTION: ");
    console.log(err);
});


