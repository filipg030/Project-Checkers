const express = require("express")
const app = express()
const PORT = 3000;

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const socketio = new Server(server);

socketio.on('connection', (client) => {
    client.on("newBoard", (data) => {
        // console.log(data)
        socketio.emit("newBoard", data);
    })
    client.on("startTimer", (data) => {
        socketio.emit("timer", data)
    })
    client.on("winner", (data) => {
        socketio.emit("winScreen", data)
    })
    client.on("pieceKill", (data) => {
        socketio.emit("removePiece", data)
    })
});


app.use(express.json());

let usersOnline = []


const path = require("path")
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/dist/index.html"))
})
app.post("/addUser", function (req, res) {
    console.log(usersOnline)

    if (usersOnline.length < 2) {
        let username = req.body.username
        if (usersOnline.includes(username)) {
            let data = {
                sameName: "Juz istnieje ten nick"
            }
            res.send(data)
        } else {
            usersOnline.push(username)
            let data = {
                username: username,
                player: usersOnline.length
            }
            res.send(data)
        }
    } else {
        let data = {
            errorMess: 'Już jest pelne lobby!'
        }
        res.send(data)
    }
})
app.post("/resetUsers", function (req, res) {
    usersOnline = []
    console.log(usersOnline)
    res.send("Zresetowano!")
})
app.post("/playerTwoHere", function (req, res) {
    let obj = {
        playerCount: usersOnline.length
    }
    res.send(obj)
})


app.use(express.static("dist"))


server.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})