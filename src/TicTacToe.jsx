import {useState} from 'react';
import './TicTacToe.css'

const gridSize = 3;

function generateGrid(size) {
    const lines = [];
    for (let r=0;r<size*size;r++) {
        lines.push(null);
    }
    return lines;
}

const initialGrid = generateGrid(gridSize);

export default function TicTacToe() {
    const [board, setBoard] = useState(initialGrid);
    const [currentPlayer, setCurrentPlayer] = useState('0');

    const handleSpotClick = (index) => {
        if (board[index]) return;

        const updatedBoard = board;
        updatedBoard[index] = currentPlayer;
        setBoard(updatedBoard);
        setCurrentPlayer(currentPlayer === '0' ? 'X' : '0');
    }

    return (<div><div>Tic Tac Toe</div>
    <div className="tictactoe-board">
        {board.map((value, index) => (
            <Spot key={index}
                value={value}
                disabled={!!value}
                onSpotClick={() => handleSpotClick(index)}
            />
        ))}
    </div>
     
    </div>);
}

function Spot( {value, disabled, onSpotClick} ) {
    return (<input type="button"
        value={value}
        disabled={disabled}
        onClick={onSpotClick}
        />
    )
}