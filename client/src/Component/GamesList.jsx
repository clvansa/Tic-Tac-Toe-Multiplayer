import React from 'react';
import { Grid } from '@material-ui/core';
import Blue from '@material-ui/core/colors/deepOrange'


const GamesList = ({ games, joinGameSubmit }) => {
    return (
        <Grid item xs={12} sm={4} md={2} style={{  margin: 10, marginTop: 80, borderRadius: 10 }}>
            <h4>Game List:</h4>
            <ul style={{ listStyle: "none", textAlign: "left", margin: 5 }}>
                {
                    games.map((item, index) =>

                        <li
                            onClick={() => joinGameSubmit("Unknown", item.id)}
                            key={index}
                            style={{ borderBottom: "1px solid #eee", padding: 10 }}
                        >{item.id}</li>
                    )
                }
            </ul>
        </Grid >
    )
}

export default GamesList
