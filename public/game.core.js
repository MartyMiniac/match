getSessionInfo()

$('document').ready(() => {
    document.getElementById('infoPane').innerHTML='<p id="preGameInfo"></p>'
})

setInterval(() => {
    document.getElementById('preGameInfo').innerHTML=`${numberOfPlayers} players joined the Game`
}, 1000)