import express from "express";
import { USERS_BBDD } from "../bbdd.js";
import fs from "fs";

const accountRouter = express.Router((req, res, next) => {
    
    fs.appendFile("log_web.txt","`${console.log(req.method)}`", (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    

    next();
});

// Obtener los detalles de una cuenta a partir de guid
accountRouter.get("/:guid", (req,res) => {
    const { guid } = req.params;
    const user = USERS_BBDD.find((user) => user.guid === guid);

    if(!user) return res.status(404).send();
    
    return res.send(user);
});

//Crear una cuenta
accountRouter.post("/", (req,res) => {
    const { guid, name } = req.body;

    if(!guid || !name) return res.state(400).send();

    const user = USERS_BBDD.find((user) => user.guid === guid);
    if(user) return res.status(409).send();

    USERS_BBDD.push({
        guid,
        name,
    });

    return res.send();
});

//Actualizar el nombre de una cuenta
accountRouter.patch("/:guid",(req,res) => {
    const { guid } = req.params;
    const { name } = req.body;

    if(!name) return res.state(400).send();

    const user = USERS_BBDD.find((user) => user.guid === guid);

    if(!user) res.status(404).send();

    user.name = name;

    return res.send();
});


accountRouter.delete("/:guid",(req,res) => {
    const {guid} = req.params;
    const userIndex = USERS_BBDD.findIndex((user) => user.guid === guid);

    if(userIndex === -1) return res.status(404).send();
    USERS_BBDD.splice(userIndex, 1);
    
    res.send();
});


export default accountRouter;