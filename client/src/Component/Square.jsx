import React from 'react'

const Square = ({ value, onClick, canPlay, enabled, isWinnerSquare, openRoom }) => {
    const canSelect = canPlay && enabled && openRoom;
    const btnClassName = canSelect ? '' : 'disable';
    const winningClass = isWinnerSquare ? 'squareWin' : ''
    return (
        <div className='square'>
            <button
                className={`squareBtn ${btnClassName} ${winningClass}`}
                onClick={onClick}
                disabled={!canSelect}
            >
                {value}
            </button>
        </div>
    )
}

export default Square
