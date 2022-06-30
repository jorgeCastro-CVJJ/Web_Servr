
import express from "express";
import dotenv from "dotenv";
import accountRouter from "./routes/account.js";

dotenv.config();

const PORT  = 3000;
const server = express();

server.use(express.json());
server.use(express.text());
server.use("/account",accountRouter);

server.get("/root",(req,res) => {
   console.log(req.ip);
   
   res.send();
});

server.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`)
});



