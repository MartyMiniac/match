//create a game
document.getElementById('createRoomBtn').addEventListener('click', event => {
    createRoom(document.getElementById('playerNameInputCreate').value, document.getElementById('playerCountInput').value)
    window.location.href="/game"
})

//join a game
document.getElementById('joinRoomBtn').addEventListener('click', event => {
    joinRoom(document.getElementById('roomIdInput').value, document.getElementById('playerNameInputJoin').value)
    window.location.href="/game"
})
