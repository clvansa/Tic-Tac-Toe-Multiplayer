import React, { useState, useEffect } from 'react'
import { Container } from '@material-ui/core';
import Board from './Board';
import io from 'socket.io-client';

let socket;
const Game = ({ name, gameId }) => {
    const [player, setPlayer] = useState({});
    const [game, setGame] = useState([])
    const [notification, setNotification] = useState([])
    const [winner, setWinner] = useState(null);
    const [openRoom, setOpenRoom] = useState(true)
    const SERVER_ENDPOINT = 'https://tic-tac-online.herokuapp.com'

    useEffect(() => {
        const event = gameId ? 'joinGame' : 'createGame';
        socket = new io.connect(SERVER_ENDPOINT);
        socket.emit(event, { name, gameId })

        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [])
    useEffect(() => {
        socket.on('notification', (data) => {
            const { message = '' } = data;

            notification.push(message)
            setNotification([...notification])
        })

    }, [])


    useEffect(() => {
        socket.on('playerCreated', data => {
            const { player } = data
            setPlayer(player)
        })

        socket.on('gameUpdated', data => {
            const { game } = data
            setGame(game)
        })
        socket.on('gameEnd', data => {
            const { winner } = data;
            setWinner(winner)
        })
        socket.on('leaveRoom', () => {
            setOpenRoom(false)
        })

    }, [socket])

    const onSquareClick = (value) => {
        socket.emit('moveMade', {
            square: value,
            player,
            gameId: game.id
        })
    }

    const getWinnerMessage = () => {
        return winner.player.id === player.id ? 'You Win' : 'You Lose!'
    }

    const turnMessage = game.playerTurn === player.id ? 'Your Move' : 'Opponunt Turn';
    const winnerMessage = winner ? getWinnerMessage() : 'Draw Game!';
    const colorMessage = winnerMessage === 'You Win' ? 'green' : 'red'
    const restartGame = () => {
        socket.emit('restartGame', { gameId: game.id })
    }
    return (
        <Container style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <h4>Welcome {player.name}</h4>
            {game.status === 'playing' && <h5>  {turnMessage}</h5>}
            {
                game && <div><h5>{`Game ID: ${game.id}`} </h5>
                    <strong>You are playing ({player.symbol})</strong>
                </div>
            }
            {game.status === 'gameOver' &&
                <div style={{ background: colorMessage, margin: 20, fontSize: "2rem", color: "#fff" }}>{winnerMessage} </div>}
            <Board player={player} game={game} onSquareClick={onSquareClick} winner={winner} openRoom={openRoom} />
            {
                notification.map((message, index) => (
                    <p key={index}>{message}</p>
                ))
            }
            {
                game.player1 && game.player1.id === player.id &&
                <button onClick={restartGame}>Restart</button>
            }
            {!openRoom && <p>Your friend is already leave </p>}
        </Container >
    )
}

export default Game
