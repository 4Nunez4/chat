import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import { PORT } from "./config.js";

const app = express();

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors:{origin:'*'}
});

app.use(cors());
app.use(morgan("dev"));

io.on('connection',(Socket) =>{
    console.log(Socket.id)

    Socket.on('message',(message) =>{
       Socket.broadcast.emit('message',{
        body: message,
        from: Socket.id,
       })
    });
})

server.listen(PORT);
console.log("se esta ejecutando en el puerto", +PORT);
