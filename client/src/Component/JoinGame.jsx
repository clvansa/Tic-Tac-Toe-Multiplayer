import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = {
    margin: {
        marginTop: 10
    }
}

const JoinGame = ({ onFormSubmit }) => {
    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');

    return (
        <Grid item  >
            <h4>Join game</h4>
            <Grid item xs={12}  >
                <TextField
                    id="outlined-basic"
                    label="Enter your name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}  >
                <TextField
                    id="outlined-basic"
                    label="Enter your game ID"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setGameId(e.target.value)}
                    style={styles.margin} />
            </Grid>
            <Grid item xs={12}  >
                <Button
                    title="Create Game"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => onFormSubmit(name, gameId)}
                    style={styles.margin} >
                    Join Game</Button>
            </Grid>

        </Grid >
    )
}

export default JoinGame
