const players = [];

const createPlayer = (id, name, gameId, symbol) => {
    const player = {
        id,
        name,
        gameId,
        symbol
    }
    players.push(player)
    return player
}

const getPlayer = (id) => {
    return players.find(player => player.id === id)
}

const removePlayer = (id) => {
    const index = players.findIndex((player) => player.id === id)
    if(index !== -1){
        players.splice(index, 1)
    }
}
module.exports = { createPlayer, getPlayer, removePlayer }