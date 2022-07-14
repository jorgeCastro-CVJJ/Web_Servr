const fs = require('fs');

function writeDataToFile(filename, content){
    fs.appendFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if(err){
            console.log(err)
        };
    });
};


function getPostData(req){
    return new Promise((resolve, reject)=>{
        try{
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            })

            req.on('end',() => {
                resolve(body)
            })
        } catch (err){

        }
    })
}


function writeDataLog(filename, content){
    fs.writeFileSync(filename, content, 'utf8',(err) => {
        if(err){
            console.log(err)
        }
    })
}



module.exports = {
    writeDataToFile,
    writeDataLog,
    getPostData
}