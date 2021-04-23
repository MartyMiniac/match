const express = require('express')
const app =express()
const http = require('http').Server(app)
const path = require('path')
const io = require('socket.io')(http)
const cookieParser = require('cookie-parser')
const cookie = require('cookie')
const uidGenerator = require('uid-generator')

const roomIdGen = new uidGenerator(32)
const sessGen = new uidGenerator()

const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => {
    if(req.cookies.sesskey) {        
        return res.sendFile(path.resolve(__dirname+'/views/index.html'))
    }
    sessGen.generate()
    .then(uid => {
        res.cookie('sesskey',uid)
        return res.sendFile(path.resolve(__dirname+'/views/index.html'))
    })
})

app.get('/game', (req, res) => {
    res.sendFile(path.resolve(__dirname+'/views/game.html'))
})

let rooms = {}
let session = {}

io.on('connection', socket => {

    console.log('client connected')

    socket.on('getSessionInfo', () => {
        console.log(session)
        let cookies = cookie.parse(socket.handshake.headers.cookie)
        socket.emit('sendSessionInfo', session[cookies.sesskey])
    })

    socket.on('joinGame', val => {
        let cookies = cookie.parse(socket.handshake.headers.cookie)
        console.log('joined game', val.roomID)
        socket.join(val.roomID)
        if(rooms[val.roomID]) {
            rooms[val.roomID].numberOfPlayers++
            rooms[val.roomID].playerList.push({
                sesskey: cookies.sesskey,
                playerName: val.playerName
            })
        }
        else {
            //handle error
        }
        console.log(rooms)
        emitClientChanges(val.roomID)
    })

    socket.on('createRoom', val => {
        let cookies = cookie.parse(socket.handshake.headers.cookie)
        console.log(cookies)
        roomIdGen.generate()
        .then(uid => {
            session[cookies.sesskey]={
                roomId: uid,
                playerName: val.playerName
            }
            rooms[uid]={
                numberOfPlayers: 0,
                expectedPlayers: parseInt(val.playerCount),
                playerList: []
            }
        })
    })

    socket.on('joinRoom', val => {
        let cookies = cookie.parse(socket.handshake.headers.cookie)
        console.log(cookies)
        session[cookies.sesskey]={
            roomId: val.roomId,
            playerName: val.playerName
        }
    })

    socket.on('message', msg => {
        io.to(Array.from(socket.rooms)[1]).emit('back', msg)
    })

    socket.on('leaveGame', val => {
        let cookies = cookie.parse(socket.handshake.headers.cookie)
        roomId=Array.from(socket.rooms)[1]
        socket.leave(roomId)
        rooms[roomId].numberOfPlayers--
        rooms[roomId].playerList.filter((value, index) => {
            return value.sesskey!=cookies.sesskey
        })
        console.log(rooms)
        emitClientChanges(roomId)
    })

    socket.on('disconnecting', () => {
        let cookies = cookie.parse(socket.handshake.headers.cookie)
        roomId=Array.from(socket.rooms)[1]
        if(roomId && rooms[roomId]) {
            socket.leave(roomId)
            rooms[roomId].numberOfPlayers--
            rooms[roomId].playerList.filter((value, index) => {
                return value.sesskey!=cookies.sesskey
            })
        }
        console.log(rooms)

        emitClientChanges(roomId)
    })

    socket.on('disconnect', socket => {
        console.log('client disconnected')
        
    })
})

const emitClientChanges = (roomId) => {
    try {
        io.to(roomId).emit('clientNumberChange', rooms[roomId].numberOfPlayers)
    }
    catch {
        //expected
    }
}

http.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`)
})