import React from 'react';
import Square from './Square';


const Board = ({ player, game, onSquareClick, winner, openRoom }) => {
    const { playBoard = [], status = 'waiting' } = game;
    const enabled = status === 'playing';
    const canPlay = player.id === game.playerTurn;


    const { winnerCombination = [] } = winner || {};
    return (
        <div className='board'>
            {playBoard.map((item, index) => {
                const isWinnerSquare = game.status === 'gameOver' && winnerCombination.includes(index)
                return <Square
                    key={index}
                    value={item}
                    onClick={() => onSquareClick(index)}
                    enabled={enabled}
                    canPlay={canPlay}
                    openRoom={openRoom}
                    isWinnerSquare={isWinnerSquare}

                />
            })}
        </div>
    )
}

export default Board
