const http = require('http');
const express = require('express')
const path = require('path');
const app = express()
const server = http.createServer(app);
const io = require('socket.io')(server);
const cors = require('cors')
const { makeKey, checkWinner } = require('./util');
const { createGame, getGame, updateGame, removeGame, games } = require('./controller/games');
const { createPlayer, getPlayer, removePlayer } = require('./controller/players');


// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://tic-tac-online.herokuapp.com']
const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable")
            callback(null, true)
        } else {
            console.log("Origin rejected")
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))

io.on('connection', socket => {
    games.forEach(game => {
        game.player1 === null || game.player2 === null && io.emit('search', games)

    })
    socket.on('disconnect', () => {
        const player = getPlayer(socket.id);
        if (player) {
            removePlayer(player.id);
            const game = games.find((g) => g.player1.id === player.id)
            if (game) {
                io.to(game.id).emit('leaveRoom')
                removeGame(game.id)
                socket.broadcast.to(game.id).emit('search', games)
                return
            } else {
                const game = games.find((g) => g.player2.id);
                if (game) {
                    game.player2 = null;
                    game.playBoard = Array(9).fill(null);
                    game.playerTurn = game.player1.id
                    game.winner = null;
                    game.status = 'playing';
                    socket.emit('gameUpdated', { game });
                    socket.broadcast.to(game.id).emit('leaveRoom')
                    socket.broadcast.emit('notification', { message: ` has leave the game ` });
                    return
                } else {
                    return
                }
            }
        }

    })
    // Player Create new game
    socket.on('createGame', ({ name }) => {
        const gameId = `game=${makeKey()}`;
        const player = createPlayer(socket.id, name, gameId, 'X')
        const game = createGame(gameId, player.id, null)
        io.emit('search', games)
        socket.join(gameId)

        // game.player1 = player;
        game.playerTurn = socket.id;

        updateGame(gameId)


        socket.emit('playerCreated', { player });
        socket.emit('gameUpdated', { game })

        socket.emit('notification', {
            message: ` The game has been created. Game ID: ${gameId}. Send this to your friend to join you  `
        })

        socket.emit('notification', {
            message: `Waiting for opponent...`
        })
    })

    // Player Join new game
    socket.on('joinGame', ({ name, gameId }) => {

        //Check game id
        const game = getGame(gameId);

        if (!game) {
            socket.emit('notification', {
                message: `Invalid game id`
            })
            return
        }

        //Check max player
        if (game.player2) {
            socket.emit('notification', {
                message: `Game is full`
            })
            return
        }

        //Create player 
        const player = createPlayer(socket.id, name, gameId, 'O');

        //Update Game
        game.player2 = player.id;
        game.status = 'playing';
        updateGame(game);

        //Notify other player
        socket.join(gameId)
        socket.emit('playerCreated', { player });
        socket.emit('gameUpdated', { game });

        // Broadcast player1
        socket.broadcast.to(gameId).emit('gameUpdated', { game });
        socket.broadcast.to(gameId).emit('notification', { message: `${name} has joined the game ` });
    })

    //Player MoveMade
    socket.on('moveMade', data => {
        const { player, square, gameId } = data;

        //Get the game
        const game = getGame(gameId);
        //Validation 

        //update the borad
        const { playBoard = [], playerTurn, player1, player2 } = game;
        playBoard[square] = player.symbol;

        //Update the player turn
        const nextTurnId = playerTurn === player1 ? player2 : player1

        //update game
        game.playerTurn = nextTurnId
        game.playBoard = playBoard
        updateGame(gameId)

        // Brodcase game updated
        io.in(gameId).emit('gameUpdated', { game })

        //Check win 
        const hasWon = checkWinner(playBoard);
        if (hasWon) {
            const winner = { ...hasWon, player }
            game.status = 'gameOver';
            updateGame(game);
            io.in(gameId).emit('gameUpdated', { game })
            io.in(gameId).emit('gameEnd', { winner })
            return
        }

        //Draw 
        const emptySquareIndex = playBoard.findIndex(item => item === null)
        if (emptySquareIndex == -1) {
            game.status = 'gameOver';
            updateGame(game);
            io.in(gameId).emit('gameUpdated', { game })
            io.in(gameId).emit('gameEnd', { winner: null })
            return
        }
    })

    //Restart Game 
    socket.on('restartGame', data => {
        const { gameId } = data
        const game = getGame(gameId)
        game.playBoard = Array(9).fill(null);
        game.winner = null;
        game.status = 'playing';
        io.in(gameId).emit('gameUpdated', { game })
    })

})



const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })
}

server.listen(PORT, () => {
    console.log('Sever is Ready')
})
