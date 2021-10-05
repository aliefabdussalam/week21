const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const routerregister = require('./source/router/register.router')
const http = require('http')
const {Server} = require('socket.io')
const db = require('./source/config/db');




const app = express()
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
app.use(bodyParser.json())
app.use(routerregister)

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
})
io.on("connection", (socket) => {
    console.log(" a client connected ")

    socket.on("login", (room)=>{
        socket.join(room)
        console.log("a user join room" + room)
    })
    socket.on("send-message", (payload) => {
        const {sender, receiver, msg} = payload
        db.query(`
        insert into message (sender, receiver, message)
        value ('${sender}', '${receiver}', '${msg}')`,
        (err, result) => {
            
            io.to(receiver).emit('list-message', payload)
        })
        
    })
    socket.on("get-message", ({receiver, sender}) => {
        db.query(`
        select * from message where (sender="${sender}" and receiver="${receiver}") or (sender="${receiver}" and receiver="${sender}") `, (err, result) => {
            io.to(sender).emit('history-message', result)
            console.log(result)
        })
    })
    socket.on("send-user", (value) => {
        io.emit("get-user", value)
        socket.broadcast.emit("get-message-broadcast", value)
    })
    socket.on("send-message-private", (payload) => {
        const { room, msg, username } = payload
        console.log(msg)
        io.to(room).emit("get-message-private", {msg, username})
    })

    socket.on("disconnect", () => {
        console.log("a client disconnected")
    })
})



const PORT = 8800
httpServer.listen(PORT, () => {
    console.log(`service running on port ${PORT}`)
})
module.exports = app;