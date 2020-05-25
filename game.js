paddleSize = [10, 100]

class GameObject {
    constructor(pos, size) {
        this.pos = pos
        this.size = size
    }

    get left() {
        return this.pos[0] - this.size[0]/12
    }

    get right() {
        return this.pos[0] + this.size[0]/12
    }

    get top() {
        return this.pos[1] - this.size[1]/12
    }

    get bottom() {
        return this.pos[1] + this.size[1]/12
    }
}

class Paddle extends GameObject{
    constructor(playerId) {
        if(playerId === 1) {
            super([1, 50], paddleSize)
        }
        else {
            super([99, 50], paddleSize)
        }
        this.playerId = playerId
    }
}

class Ball extends GameObject { 
    constructor() { 
        super([50, 50], [10, 10])
        this.vel = [0, 0]
    }

    startBall() {
        this.pos = [50, 50]
        this.changeSpeed(1, -91)
    }

    bounce(player) {
        let yDiff = -(this.pos[1] - player.pos[1])
        let newAngle = (((yDiff/(player.size[1]/12)) * 45) + 90) * (-this.angle/Math.abs(this.angle))
        this.changeSpeed((this.speed) + .01, newAngle)
    }

    bounceEdge() { 
        this.vel[1] = -this.vel[1]
    }

    get speed() { 
        return Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2))
    }

    get angle() { 
        return Math.atan(this.vel[0]/Math.abs(this.vel[1])) * (180/Math.PI)
    }

    changeSpeed(_speed, _angle) { 

        _angle = _angle * Math.PI/180
        this.vel[0] = Math.sin(_angle) * _speed
        this.vel[1] = Math.cos(_angle) * _speed
    }
}



class Game { 
    constructor() {
         this.ball = new Ball()
         this.players = [new Paddle(1), new Paddle(2)]
         this.score = [0, 0]
    }

    move(player, newPos) { 
        this.players[player].pos[1] = newPos
    }

    get data() {
         return [this.ball.pos, [this.players[0].pos, this.players[1].pos], this.score]
    }

    start() {
        this.ball.startBall()
        let scored = false

        let main = setInterval(() => {
            this.ball.pos[0] += this.ball.vel[0]
            this.ball.pos[1] += this.ball.vel[1]

            if(this.ball.top <= 0 || this.ball.bottom >= 100) { 
                this.ball.bounceEdge()
            }

            this.players.forEach((player) => { 
                if(this.ball.left <= player.right && this.ball.right >= player.left && this.ball.top <= player.bottom && this.ball.bottom >= player.top && !scored) {
                    
                    this.ball.bounce(player)
                
                }
                
               if(this.ball.left <= player.right && this.ball.right >= player.left && !(this.ball.top <= player.bottom && this.ball.bottom >= player.top) && !scored) {
                    scored = true
                    if(Math.abs(this.ball.vel[0]) === this.ball.vel[0]) { 
                        this.score[0]++
                    }
                    else { 
                        this.score[1]++
                    }
                    setTimeout(() => { 
                        clearInterval(main)
                        this.start()
                    }, 3000)
                }
            })
            
        }, 10)

    }
}

module.exports = Game