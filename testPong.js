
const createGameForm = document.getElementById("createGame")
const joinGameForm = document.getElementById("joinGame")

const socket = io('http://192.168.1.180:3000');

canvas = document.querySelector('#game')
ctx = canvas.getContext("2d")
canvasWidth = canvas.width
canvasHeight = canvas.height

ballSize = [10, 10]
paddleSize = [10, 100]

//Socket Events
let gameData

socket.on('updateData', (data) => { 
    gameData = data
})

onmousemove = (e) => { 
    yPos = (e.clientY - canvas.offsetTop)/canvasHeight * 100
    socket.emit('updatePosition', yPos)
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

setInterval(() => {
    draw()
}, 10)




