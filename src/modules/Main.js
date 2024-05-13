import { Scene } from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import Panel from './ChessboardPanel'
import { Raycaster } from 'three';
import { Vector2 } from 'three';
import Pawn from './Pawn';
import { Tween, Easing } from '@tweenjs/tween.js'
import { allNetFunctions } from './Net';
import { io } from "https://cdn.socket.io/4.6.0/socket.io.esm.min.js";

const client = io("ws://127.0.0.1:3000")


const container = document.getElementById('root');
let chessboard = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
]
let pieces = [ // 1-biale 2 -czarne
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
]
pieces = [ // for testing
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
]
const scene = new Scene()
const renderer = new Renderer(scene, container)
const camera = new Camera(renderer.threeRenderer)
const raycaster = new Raycaster()
const mouseVector = new Vector2()
const notYourGo = document.getElementById("notYourGoScreen")
const winScreen = document.getElementById("winScreen")
const lossScreen = document.getElementById("lossScreen")
let secondsLeft = 30

client.on("newBoard", (data) => {
    // console.log("Updated Board")
    pieces = data.table
    GameObject.moveDaPiece(data.oldPos, data.newPos, data.id)
})
client.on("winScreen", (data) => {
    GameObject.endGame(data.winner)
})
client.on("removePiece", (data) => {
    // console.log("Removed Piece")
    let posx = data.posX
    let posz = data.posZ
    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].geometry.type == "CylinderGeometry") {
            if (scene.children[i].position.x == posx && scene.children[i].position.z == posz) {
                scene.remove(scene.children[i])
            }
        }
    }
    let iandk = GameObject.findPanelPos(posx, posz)
    // console.log(iandk)
    pieces[iandk[0]][iandk[1]] = 0

})
client.on("timer", (data) => {
    secondsLeft = 30
    // if player == true => bialy ma timer a czarny ma waiting screen
    if (data.player) {
        if (camera.getCurrPos() == GameObject.player1name) {
            notYourGo.style.display = 'none'
            timerInterval()
        } else {
            notYourGo.style.display = 'block'
            document.getElementById("navbar").innerHTML = ""
        }
    } else {
        if (camera.getCurrPos() == GameObject.player1name) {
            notYourGo.style.display = 'block'
            document.getElementById("navbar").innerHTML = ""

        } else {
            notYourGo.style.display = 'none'
            timerInterval()
        }
    }
})
let timerInterval = function () {
    const int_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER)
    for (let i = 1; i < int_id; i++) {
        window.clearInterval(i)
    }
    return setInterval(() => {
        if (secondsLeft == 0) {
            setTimeout(() => {
                if (notYourGo.style.display == "none") {
                    document.getElementById("navbar").innerHTML = "Przegrana :("
                    if (camera.getCurrPos() == GameObject.player1name) {
                        allNetFunctions.winner("black")
                    } else {
                        allNetFunctions.winner("white")
                    }
                } else {
                    document.getElementById("navbar").innerHTML = "Wygrana :)"
                    if (camera.getCurrPos() == GameObject.player1name) {
                        allNetFunctions.winner("white")
                    } else {
                        allNetFunctions.winner("black")
                    }
                }
            }, 50);

        }
        document.getElementById("navbar").innerHTML = "Pozostało " + secondsLeft + "s do końca ruchu!"
        secondsLeft = secondsLeft - 1
    }, 1000);
}
function genBoard() {
    for (let i = 0; i < chessboard.length; i++) {
        for (let k = 0; k < chessboard[i].length; k++) {
            if (chessboard[i][k] == 1) {
                let panel = new Panel(scene, "white")
                panel.color = "white"
                panel.updatePos((i * 50) + 25, (k * 50) + 25)
            } else {
                let panel = new Panel(scene, "black")
                panel.color = "black"
                panel.canMoveHere = function () {
                    return panel.highlight()
                }
                panel.cantMoveHere = function () {
                    return panel.unhighlight()
                }
                panel.updatePos((i * 50) + 25, (k * 50) + 25)
            }

        }
    }
}
genBoard()
const GameObject = {
    player1name: 500,
    player2name: -100,
    endGame(winner) {
        const int_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER)
        for (let i = 0; i < int_id; i++) {
            window.clearInterval(i)
        }
        if (winner == "white") {
            if (camera.getCurrPos() == this.player1name) {
                winScreen.style.display = 'block'
            } else {
                lossScreen.style.display = 'block'
            }
        } else {
            if (camera.getCurrPos() == this.player1name) {
                lossScreen.style.display = 'block'
            } else {
                winScreen.style.display = 'block'
            }
        }
    },
    findPanelPos(x, z) {
        let i = (x - 25) / 50
        let k = (z - 25) / 50
        return [i, k]
    },

    render() {

        // // console.log("render leci")
        if (GameObject.currTween) {
            GameObject.currTween.update()
        }

        renderer.render(scene, camera.threeCamera);

        requestAnimationFrame(GameObject.render);
    },
    playerOneReady(player1name) {
        camera.startGamePos(1)
        GameObject.generatePieces()
        document.getElementById("loadingScreen").style.display = "block"
        let checkForPlayer = setInterval(() => {
            let data = JSON.stringify({
                username: "."
            })

            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                // BAD REQUEST 
                body: data
            };
            fetch("/playerTwoHere", options)
                .then(response => response.json())
                .then(data => {
                    if (data.playerCount == 2) {
                        clearInterval(checkForPlayer)
                        document.getElementById("loadingScreen").style.display = "none"
                        GameObject.gameStart()
                        allNetFunctions.startTimer(this.whiteMove)
                    }
                })
        }, 1000);
    },
    playerTwoReady(player2name) {
        camera.startGamePos(2)
        GameObject.generatePieces()
        GameObject.gameStart()
    },
    whiteMove: true,
    generatePieces() {
        for (let i = 0; i < pieces.length; i++) {
            for (let k = 0; k < pieces[i].length; k++) {
                if (pieces[i][k] == 1) {
                    let piece = new Pawn(scene, "white")
                    piece.color = "white"
                    piece.updatePos((i * 50) + 25, (k * 50) + 25)
                    piece.selects = function () {
                        if (GameObject.whiteMove) {
                            for (let i = 0; i < scene.children.length; i++) {
                                if (scene.children[i].geometry.type == "BoxGeometry") {
                                    if ((scene.children[i].position.x == this.position.x - 50 && scene.children[i].position.z == this.position.z - 50) || (scene.children[i].position.x == this.position.x - 50 && scene.children[i].position.z == this.position.z + 50)) {
                                        if (pieces[GameObject.findPanelPos(scene.children[i].position.x, scene.children[i].position.z)[0]][GameObject.findPanelPos(scene.children[i].position.x, scene.children[i].position.z)[1]] == 0) {
                                            scene.children[i].canMoveHere()
                                            scene.children[i].allowMove = true
                                            scene.children[i].beatPotential = false
                                        } else if (pieces[GameObject.findPanelPos(scene.children[i].position.x, scene.children[i].position.z)[0]][GameObject.findPanelPos(scene.children[i].position.x, scene.children[i].position.z)[1]] == 1) {
                                            scene.children[i].cantMoveHere()
                                            scene.children[i].allowMove = false
                                            scene.children[i].beatPotential = false
                                        } else {
                                            if (scene.children[i].position.z == this.position.z - 50) {
                                                // right
                                                let checkHere = [this.position.x - 100, this.position.z - 100]
                                                if (pieces[GameObject.findPanelPos(checkHere[0], checkHere[1])[0]][GameObject.findPanelPos(checkHere[0], checkHere[1])[1]] == 0) {
                                                    // console.log(checkHere, "THIS IS OK")
                                                    scene.traverse((el) => {
                                                        if (el.position.x == checkHere[0] && el.position.z == checkHere[1] && el.geometry.type == 'BoxGeometry') {
                                                            el.canMoveHere()
                                                            el.allowMove = true
                                                            el.beatPotential = true
                                                            el.beatPiecePos = {
                                                                x: this.position.x - 50,
                                                                z: this.position.z - 50
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    // console.log(checkHere, "THIS IS (NOT) OK")
                                                }
                                            } else {
                                                // left
                                                let checkHere = [this.position.x - 100, this.position.z + 100]
                                                if (pieces[GameObject.findPanelPos(checkHere[0], checkHere[1])[0]][GameObject.findPanelPos(checkHere[0], checkHere[1])[1]] == 0) {
                                                    // console.log("THIS IS OK")
                                                    scene.traverse((el) => {
                                                        if (el.position.x == checkHere[0] && el.position.z == checkHere[1] && el.geometry.type == 'BoxGeometry') {
                                                            el.canMoveHere()
                                                            el.allowMove = true
                                                            el.beatPotential = true
                                                            el.beatPiecePos = {
                                                                x: this.position.x - 50,
                                                                z: this.position.z + 50
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    // console.log(checkHere, "THIS IS (NOT) OK")
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                            return piece.select()
                        }
                    }
                    piece.updatePosition = function (x, z) {
                        return piece.updatePos(x, z)
                    }
                    piece.deselects = function () {
                        for (let i = 0; i < scene.children.length; i++) {
                            if (scene.children[i].geometry.type == "BoxGeometry") {
                                if (scene.children[i].allowMove == true) {
                                    scene.children[i].cantMoveHere()
                                    scene.children[i].allowMove = false
                                }
                            }
                        }
                        return piece.deselect()
                    }
                    piece.idpiece = { id: i.toString() + k.toString() }

                } else if (pieces[i][k] == 2) {
                    let piece = new Pawn(scene, "black")
                    piece.updatePos((i * 50) + 25, (k * 50) + 25)
                    piece.selects = function () {
                        if (!GameObject.whiteMove) {
                            for (let i = 0; i < scene.children.length; i++) {
                                if (scene.children[i].geometry.type == "BoxGeometry") {
                                    if ((scene.children[i].position.x == this.position.x + 50 && scene.children[i].position.z == this.position.z - 50) || (scene.children[i].position.x == this.position.x + 50 && scene.children[i].position.z == this.position.z + 50)) {
                                        if (pieces[GameObject.findPanelPos(scene.children[i].position.x, scene.children[i].position.z)[0]][GameObject.findPanelPos(scene.children[i].position.x, scene.children[i].position.z)[1]] == 0) {
                                            scene.children[i].canMoveHere()
                                            scene.children[i].allowMove = true
                                            scene.children[i].beatPotential = false
                                        } else if (pieces[GameObject.findPanelPos(scene.children[i].position.x, scene.children[i].position.z)[0]][GameObject.findPanelPos(scene.children[i].position.x, scene.children[i].position.z)[1]] == 2) {
                                            scene.children[i].cantMoveHere()
                                            scene.children[i].allowMove = false
                                            scene.children[i].beatPotential = false
                                        } else {
                                            if (scene.children[i].position.z == this.position.z - 50) {
                                                // left
                                                let checkHere = [this.position.x + 100, this.position.z - 100]
                                                if (pieces[GameObject.findPanelPos(checkHere[0], checkHere[1])[0]][GameObject.findPanelPos(checkHere[0], checkHere[1])[1]] == 0) {
                                                    // console.log(checkHere, "THIS IS OK")
                                                    scene.traverse((el) => {
                                                        if (el.position.x == checkHere[0] && el.position.z == checkHere[1] && el.geometry.type == 'BoxGeometry') {
                                                            el.canMoveHere()
                                                            el.allowMove = true
                                                            el.beatPotential = true
                                                            el.beatPiecePos = {
                                                                x: this.position.x + 50,
                                                                z: this.position.z - 50
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    // console.log(checkHere, "THIS IS (NOT) OK")
                                                }
                                            } else {
                                                // right
                                                let checkHere = [this.position.x + 100, this.position.z + 100]
                                                if (pieces[GameObject.findPanelPos(checkHere[0], checkHere[1])[0]][GameObject.findPanelPos(checkHere[0], checkHere[1])[1]] == 0) {
                                                    // console.log(checkHere, "THIS IS OK")
                                                    scene.traverse((el) => {
                                                        if (el.position.x == checkHere[0] && el.position.z == checkHere[1] && el.geometry.type == 'BoxGeometry') {
                                                            el.canMoveHere()
                                                            el.allowMove = true
                                                            el.beatPotential = true
                                                            el.beatPiecePos = {
                                                                x: this.position.x + 50,
                                                                z: this.position.z + 50
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    // console.log(checkHere, "THIS IS (NOT) OK")
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return piece.select()
                        }
                    }
                    piece.color = "black"
                    piece.updatePosition = function (x, z) {
                        return piece.updatePos(x, z)
                    }
                    piece.idpiece = { id: i.toString() + k.toString() }
                    piece.deselects = function () {
                        for (let i = 0; i < scene.children.length; i++) {
                            if (scene.children[i].geometry.type == "BoxGeometry") {
                                if (scene.children[i].allowMove == true) {
                                    scene.children[i].cantMoveHere()
                                    scene.children[i].allowMove = false
                                }
                            }
                        }
                        return piece.deselect()
                    }
                }

            }
        }
    },
    currTween: false,
    moveDaPiece(oldPos, newPos, id) {
        let pieceToMove
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].geometry.type == "CylinderGeometry") {
                if (scene.children[i].idpiece.id == id) {
                    pieceToMove = scene.children[i]
                }
            }
        }
        GameObject.currTween = new Tween(pieceToMove.position) // start
            .to({ x: newPos.x, z: newPos.z }, 500) // do jakiej pozycji, w jakim czasie
            .easing(Easing.Quadratic.InOut) // typ easingu (zmiana w czasie)
            .onUpdate((coords) => {
                pieceToMove.position.x = coords.x
                pieceToMove.position.z = coords.z
            })
            .onComplete(() => {
                if (GameObject.whiteMove) {
                    GameObject.whiteMove = false
                } else {
                    GameObject.whiteMove = true
                }
                // console.log("Pieces", pieces)
                let count = []
                for (let i = 0; i < pieces.length; i++) {
                    pieces[i].forEach(element => {
                        count[element] = (count[element] || 0) + 1
                    });
                }

                console.log(count[1] + " whites left, " + count[2] + " blacks left")
                if (count[1] == undefined) {
                    // black win
                    allNetFunctions.winner("black")
                } else if (count[2] == undefined) {
                    // white win
                    allNetFunctions.winner("white")
                }
                allNetFunctions.startTimer(this.whiteMove)
            }) // funkcja po zakończeniu animacji
            .start()

    },

    gameStart() {
        let selectedPawn = []
        window.addEventListener("mousedown", (event) => {
            let confirmedKill = false
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera.threeCamera);
            const intersects = raycaster.intersectObjects(scene.children);
            // // console.log(intersects[0])
            if (intersects.length > 0) {
                if (camera.getCurrPos() == this.player1name) {
                    // // console.log("You are White");
                    // // console.log(intersects[0].object);
                    if (intersects[0].object.geometry.type == "CylinderGeometry" && intersects[0].object.userData.player.player == "white") {
                        if (selectedPawn[0]) {
                            selectedPawn[0].object.deselects()
                        }
                        intersects[0].object.selects()
                        selectedPawn[0] = intersects[0]
                    } else if (intersects[0].object.geometry.type == "BoxGeometry" && selectedPawn[0] && intersects[0].object.allowMove) {
                        if (intersects[0].object.beatPotential) {
                            // console.log("Killed")
                            confirmedKill = true
                        }
                        pieces[this.findPanelPos(selectedPawn[0].object.position.x, selectedPawn[0].object.position.z)[0]][this.findPanelPos(selectedPawn[0].object.position.x, selectedPawn[0].object.position.z)[1]] = 0
                        pieces[this.findPanelPos(intersects[0].object.position.x, intersects[0].object.position.z)[0]][this.findPanelPos(intersects[0].object.position.x, intersects[0].object.position.z)[1]] = 1
                        selectedPawn[0].object.deselects()
                        allNetFunctions.movedPiece(selectedPawn[0].object.idpiece.id, { x: selectedPawn[0].object.position.x, z: selectedPawn[0].object.position.z }, { x: intersects[0].object.position.x, z: intersects[0].object.position.z }, pieces)
                        if (confirmedKill) {
                            allNetFunctions.pieceKill(intersects[0].object.beatPiecePos.x, intersects[0].object.beatPiecePos.z)
                        }
                        selectedPawn = []

                    } else {
                        // console.log("Select your own pawn");
                    }
                } else {
                    // // console.log("You are black");
                    if (intersects[0].object.geometry.type == "CylinderGeometry" && intersects[0].object.userData.player.player == "black") {
                        if (selectedPawn[0]) {
                            selectedPawn[0].object.deselects()
                        }
                        intersects[0].object.selects()
                        selectedPawn[0] = intersects[0]
                    } else if (intersects[0].object.geometry.type == "BoxGeometry" && selectedPawn[0].object.position && intersects[0].object.allowMove) {
                        if (intersects[0].object.beatPotential) {
                            // console.log("killed")
                            confirmedKill = true
                        }
                        pieces[this.findPanelPos(selectedPawn[0].object.position.x, selectedPawn[0].object.position.z)[0]][this.findPanelPos(selectedPawn[0].object.position.x, selectedPawn[0].object.position.z)[1]] = 0
                        pieces[this.findPanelPos(intersects[0].object.position.x, intersects[0].object.position.z)[0]][this.findPanelPos(intersects[0].object.position.x, intersects[0].object.position.z)[1]] = 2
                        selectedPawn[0].object.deselects()
                        allNetFunctions.movedPiece(selectedPawn[0].object.idpiece.id, { x: selectedPawn[0].object.position.x, z: selectedPawn[0].object.position.z }, { x: intersects[0].object.position.x, z: intersects[0].object.position.z }, pieces)
                        if (confirmedKill) {
                            allNetFunctions.pieceKill(intersects[0].object.beatPiecePos.x, intersects[0].object.beatPiecePos.z)
                        }
                        selectedPawn = []

                    } else {
                        // console.log("Select your own pawn");
                    }
                }


            }
        });
    }

}

export { GameObject }
