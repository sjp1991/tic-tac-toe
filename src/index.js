import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function BoardButton(props) {
    return (
        <button className="boardButton" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                mover: null,
                placement: null,
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClickReplay() {
        this.setState({
            history: [{
                mover: null,
                placement: null,
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        });
    }

    handleClickSquare(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner (squares) || squares[i] || calculateTie(squares)) {
            return;
        }
        if (this.state.history.length - 1 !== this.state.stepNumber) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                mover: this.state.xIsNext ? 'X' : 'O',
                placement: i,
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
        })
    }

    renderReplay() {
        if (this.state.stepNumber > 0) {
            return (
                <BoardButton
                    value='Replay'
                    onClick={() => this.handleClickReplay()}
                />
            );
        }
    }

    renderCurrentBoard() {
        if (this.state.stepNumber > 0) {
            return (
                <BoardButton
                    value='Back to Current Board'
                    onClick={() => this.jumpTo(this.state.history.length - 1)}
                />
            );
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const latest = history[history.length - 1];
        const winner = calculateWinner(latest.squares);
        const tie = calculateTie(latest.squares);

        const moves = history.map((step, move) => {
            const desc = move ? move + '. ' + history[move].mover + ' placed on ' + history[move].placement : null;
            return (
                <li key = {move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (tie) {
            status = 'Tie';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <div>{status}</div>
                    <Board
                        squares = {current.squares}
                        onClick = {(i) => this.handleClickSquare(i)}
                    />
                    <div className="boardButton">
                        {this.renderReplay()}
                    </div>
                    <div className="boardButton">
                        {this.renderCurrentBoard()}
                    </div>

                </div>

                <div className="game-info">
                    <div>View History</div>
                    <div>{moves}</div>
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
          if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
              return squares[a];
          }
      }
      return null;
}

function calculateTie(squares) {
    let isBoardFull = true;
    for (let i = 0; i < squares.length; i++) {
        isBoardFull = isBoardFull && squares[i] != null;
    }
    return isBoardFull;
}

// ===========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);