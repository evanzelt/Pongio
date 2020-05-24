const express = require('express');
const http = require('http').Server(express);
const socketio = require('socket.io')(http)

const Room = require('./room')

const port = 3000;

let rooms = []

socketio.on('connection', (socket) => {

    console.log('user connected at ' + socket.id)

    socket.on('createRoom', (name) => {
        if(rooms.filter((r) => {return r.name === name}).length === 0) {
            room = new Room(socket.id, name)
            socket.join(name)
            rooms.push(room)
        }
        else {
            socket.emit('message', "A room with this name already exists!") 
        }
    })

    socket.on('joinRoom', (name) => {
        available = rooms.filter((room) =>  {
            return room.name === name
        })

        if(available.length > 0) {
            rooms.forEach((room) => {
                 if(room.players.includes(socket.id)) { 
                     room.players.splice(room.players.indexOf(socket.id), 1)
                 }
            })
            socket.join(name)
            available[0].joinRoom(socket.id)
            socketio.to(name).emit('message', "User " + socket.id + " has joined room " + name)
        }
        else { 
            socket.emit('message', "This room does not exist!")
        }
    })

    socket.on('updatePosition', (pos) => { 
        room = rooms.filter((r) => {
             return r.players.includes(socket.id)
        })[0]

        if(room != null) {
            room.updatePosition(socket.id, pos)
        }
    })
    
   
})

setInterval(() =>  {
    rooms.forEach((room) => {
        socketio.to(room.name).emit('updateData', room.data)
    })
}, 10)

http.listen(port, () => {
    console.log(`listening on ${port}`);
})
