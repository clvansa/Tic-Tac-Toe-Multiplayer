import React, { useState, useEffect } from 'react';
import CreateGame from '../Component/CreateGame';
import { Container, Grid } from '@material-ui/core';
import JoinGame from '../Component/JoinGame';
import Game from '../Component/Game';
import io from 'socket.io-client';
import GamesList from '../Component/GamesList';

let socket;

const HomePage = () => {
    const [showGame, setShowGame] = useState(false);
    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');
    const [gamesList, setGamesList] = useState([]);

    const SERVER_ENDPOINT = 'http://localhost:5000'


    const onFormSubmit = (name, gameId) => {
        setName(name);
        setGameId(gameId);
        setShowGame(true)
    }

    useEffect(() => {
        socket = io.connect(SERVER_ENDPOINT)
        socket.on('search', data => {
            setGamesList(data)
        })
    }, [])


    return (
        <Container style={{ textAlign: "center", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }} >
            <h3>Multiplayer X-O</h3>
            {showGame
                ?
                <Game name={name} gameId={gameId} />
                :
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}  >
                        <CreateGame onFormSubmit={onFormSubmit} />
                        <JoinGame onFormSubmit={onFormSubmit} />
                    </Grid>
                    <GamesList games={gamesList} joinGameSubmit={onFormSubmit} />
                </Grid>
            }
        </Container>
    )
}

export default HomePage
