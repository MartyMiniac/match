var socket = io();

let createRoom = (playerName, playerCount) => {
    socket.emit('createRoom', {
        playerName: playerName,
        playerCount: playerCount
    })
}

let joinRoom = (roomId, playerName) => {
    socket.emit('joinRoom', {
        roomId: roomId,
        playerName: playerName
    })
}