const Game = require('./game')

class Room {
    constructor(id, roomName) { 
        this.players = []
        this.players.push(id)
        this.game = new Game()
        this.name = roomName
    }

    get data() { 
        return this.game.data
    }

    joinRoom(id) {
        this.players.push(id)
    }

    updatePosition(id, pos) { 
        let playerIndex = this.players.indexOf(id)
        if(playerIndex === 0 || playerIndex === 1) {
            this.game.move(playerIndex, pos)
        }
    }
    
}

module.exports = Room