import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    const styles = props.idx === props.lastSquare ? "square orange" : "square";
    return (
        <button className={styles}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

function Board(props) {
    let boardSquares = [];
    for (let row = 0; row < 3; row++) {
        let boardRow = [];
        for (let col = 0; col < 3; col++) {
            boardRow.push(
                <Square
                    lastSquare={props.lastSquare}
                    idx={(row * 3) + col}
                    key={(row * 3) + col}
                    value={props.squares[(row * 3) + col]}
                    onClick={() => props.onClick((row * 3) + col)}
                />);
        }
        boardSquares.push(<div className="board-row"
            key={row}>{boardRow}</div>);
    }

    return (
        <div>
            {boardSquares}
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            lastSquare: null,
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        // save history up to this point, in case of trace backs
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // exit if game over or square already filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // set the square to X or O
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            lastSquare: i,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        lastSquare={this.state.lastSquare}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
