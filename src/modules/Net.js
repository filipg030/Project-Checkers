import { GameObject } from "./Main";
import { io } from "https://cdn.socket.io/4.6.0/socket.io.esm.min.js";

const client = io("ws://127.0.0.1:3000")

const allNetFunctions = {

    loginUser(userName) {

        const data = JSON.stringify({
            username: userName
        })

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            // BAD REQUEST 
            body: data
        };

        fetch("/addUser", options)
            .then(response => response.json())
            .then(data => {
                if (data.errorMess) {
                    document.getElementById("navbar").innerHTML = data.errorMess
                } else if (data.username) {
                    document.getElementById("navbar").innerHTML = "Witaj, " + data.username + "!"
                    console.log(data.player)
                    document.getElementById("login").style.display = "none"
                    if (data.player == 1) {
                        GameObject.playerOneReady(data.username)
                    } else {
                        GameObject.playerTwoReady(data.username)
                    }

                } else {
                    document.getElementById("navbar").innerHTML = data.sameName
                }
                // GameObject.setPlayer(...)

            }
            )
            .catch(error => console.log(error));

    },
    resetUsers() {
        const data = JSON.stringify({
            username: "123"
        })

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            // BAD REQUEST 
            body: data
        };
        fetch("/resetUsers", options)
            .then(response => response.json())
            .then(data => {

                // działania po resecie
            })
            .catch(error => console.log(error));


    },
    movedPiece(id, oldPos, newPos, table) {
        client.emit("newBoard", {
            id: id,
            oldPos: oldPos,
            newPos: newPos,
            table: table,
        })
    },
    startTimer(player) {
        client.emit("startTimer", {
            player: player
        })
    },
    winner(player) {
        client.emit("winner", {
            winner: player
        })
    },
    pieceKill(posX, posZ) {
        client.emit("pieceKill", {
            posX: posX,
            posZ: posZ
        })
    }

}

export { allNetFunctions }