const socket = io('http://localhost:3000');
const canvasDOM = document.getElementById('game')
const canvas =  canvasDOM.getContext("2d")
const createGameForm = document.getElementById("createGame")
const joinGameForm = document.getElementById("joinGame")

const barHeight = 100
const barWidth = 10

const screenWidth = canvasDOM.width
const screenHeight = canvasDOM.height

playerPosition = 50

createGameForm.onsubmit = (e) => {
    e.preventDefault()
    socket.emit('createGame', e.target.children.roomName.value)
}

joinGameForm.onsubmit = (e) => {
    e.preventDefault()
    socket.emit('joinGame', e.target.children.roomName.value)
}

onmousemove = (e) => {
    relativeY = e.clientY - canvasDOM.offsetTop - barHeight/2
    if(relativeY > 0 && relativeY < canvasDOM.height - barHeight) {
        playerPosition = relativeY/canvasDOM.height * 100
        socket.emit('updatePosition', playerPosition)
    }
}


keysPressed = []

onkeydown = (e) => {
    e.preventDefault()
    playerPosition = Math.round(playerPosition)
    if(e.keyCode === 38 && keysPressed.indexOf(38) === -1) { 
        keysPressed.push(38)
    }
    else if (e.keyCode === 40 && keysPressed.indexOf(40) === -1) {
        keysPressed.push(40)
    }
}

onkeyup = (e) => {
    e.preventDefault()
    if(e.keyCode === 38) { 
        keysPressed.splice(keysPressed.indexOf(38), 1)
    }
    else if (e.keyCode === 40) {
        keysPressed.splice(keysPressed.indexOf(40), 1)    
    }
}


setInterval(() => {
    if(keysPressed.length > 0) {
        if(playerPosition > 0 && playerPosition/100 * screenHeight + barHeight <= screenHeight) {
            key = keysPressed[0]
         if(key === 38) {
              playerPosition -= 1
         }
         else {
             playerPosition += 1
         }

         socket.emit('updatePosition', playerPosition)
        }
    }
    else if(playerPosition <= 0) {
        playerPosition += 1
    }
    else if (playerPosition/100 * screenHeight + barHeight >= screenHeight) {
        playerPosition -= 1
    }
}, 1)



socket.on('positionUpdate', positions => { 
    canvas.clearRect(0, 0, screenWidth, screenHeight);
    playerPosition = positions[0][0]
    renderBars(positions[0])
    renderBall(positions[1])
})

function renderBars(playerPos) {
    let [ player1Pos, player2Pos ] = playerPos
    canvas.fillStyle = "#0095DD";
    canvas.fillRect(0, (player1Pos/100)*screenHeight, barWidth, barHeight)
    canvas.fillRect(screenWidth-barWidth, (player2Pos/100)*screenHeight, barWidth, barHeight)
}

function renderBall(ballPos) { 
    canvas.beginPath();
    canvas.arc(ballPos[0], ballPos[1], 10, 0, Math.PI*2);
    canvas.fillStyle = "#0095DD";
    canvas.fill();
    canvas.closePath();
}