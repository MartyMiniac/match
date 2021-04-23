var socket = io();

//POST
const getSessionInfo = () => {
    socket.emit('getSessionInfo')
}

const joinGame = () => {
    socket.emit('joinGame', {
        roomID: myRoom
    })
}


const message = (msg) => {
    socket.emit('message', {
        'message': msg
    })
}

const joinRoom = (roomID) => {
    socket.emit('joinRoom', {
        roomID: roomID
    })
}
const leaveRoom = () => {
    socket.emit('leaveRoom')
}

//GET
socket.on('sendSessionInfo', val => {
    console.log(val)
    myName=val.playerName,
    myRoom=val.roomId

    joinGame()
})

socket.on('clientNumberChange', val => {
    console.log(val)
    numberOfPlayers=val
})

socket.on('back', val => {
    console.log(val)
})