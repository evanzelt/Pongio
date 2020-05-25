
const createGameForm = document.getElementById("createGame")
const joinGameForm = document.getElementById("joinGame")
const startButton = document.getElementById("start")

const messageBox = document.querySelector(".message-box")

const socket = io('http://192.168.1.20:3000');

//Initialize Canvas Context
canvas = document.querySelector('#game')
ctx = canvas.getContext("2d")
canvasWidth = canvas.width
canvasHeight = canvas.height

//Constant Game Values
ballSize = [10, 10]
paddleSize = [10, 100]

//Socket Events
let gameData

socket.on('updateData', (data) => { 
    gameData = data
})

socket.on('message', (messenger, message) => {
    let elem = document.createElement('p')
    elem.innerText = messenger + ": " + message
    elem.classList.add('message')
    messageBox.appendChild(elem)
    messageBox.scrollTop = messageBox.scrollHeight
})


//Client Events
onmousemove = (e) => { 
    yPos = (window.scrollY + e.clientY - canvas.offsetTop)/canvasHeight * 100
    socket.emit('updatePosition', yPos)
}

startButton.onclick = () => {
    socket.emit('startGame')
}

createGameForm.onsubmit = (e) => {
    e.preventDefault()
    socket.emit('createRoom', e.target.children.roomName.value)
}

joinGameForm.onsubmit = (e) => {
    e.preventDefault()
    socket.emit('joinRoom', e.target.children.roomName.value)
}

//Game Render
function draw() {
    ctx.clearRect(0 , 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "#000000"
    data = gameData
    
    let score = `${data[2][0]} - ${data[2][1]}`
    ctx.font = '70px calibri';
    ctx.textAlign = 'center'
    ctx.fillText(score, 300, 100)

    ballPos = data[0]
    playersPos = data[1]

    playersPos.forEach(pos => {
        positionX = pos[0]/100 * canvasWidth - paddleSize[0]/2
        positionY = pos[1]/100 * canvasHeight - paddleSize[1]/2

        ctx.fillRect(positionX, positionY, paddleSize[0], paddleSize[1])
    })

    ballPosX = ballPos[0]/100 * canvasWidth - ballSize[0]/2
    ballPosY = ballPos[1]/100 * canvasHeight - ballSize[1]/2

    ctx.fillRect(ballPosX, ballPosY, ballSize[0], ballSize[1])

}


//Game Loop
let gameLoop = setInterval(() => {}, 10)

socket.on('renderGame', () => { 
     gameLoop = setInterval(draw, 10)
})





