import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


const CreateGame = ({ onFormSubmit }) => {
    const [name, setName] = useState('');

    return (
        <Grid item >
            <h4>Create new game</h4>
            <Grid item xs={12} sm={12} >
                <TextField
                    id="outlined-basic"
                    label="Enter your name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={12}>
                <Button
                    title="Create Game"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => onFormSubmit(name)}
                    style={{ marginTop: 10 }}
                >
                    Create Game
                    </Button>
            </Grid>

        </Grid>
    )
}

export default CreateGame
