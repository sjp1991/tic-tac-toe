import { Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board.js';
import './bootstrap-3.3.7-dist/css/bootstrap.css';
import './index.css';

export default class Game extends React.Component {
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
        squares[i] = this.state.xIsNext ? '⛌' : '◯';
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
                    float='right'
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
            if (desc !== null) {
                return (
                    <div key = {move}>
                        <Button bsStyle="link" id="history" onClick={() => this.jumpTo(move)}>
                            {desc}
                        </Button>
                    </div>
                );
            }
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (tie) {
            status = 'Tie';
        } else if (history.length === 1) {
            status = 'Player X starts'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <Col lg={1} md={2} />
                <Col lg={5} md={6} sm={7} className="game-board">
                    <h1 className="title">Tic-Tac-Toe</h1>
                    <Board
                        squares = {current.squares}
                        onClick = {(i) => this.handleClickSquare(i)}
                    />
                    <h3 className = 'status'>{status}</h3>
                    <div className="board-buttons">
                            {this.renderReplay()}
                    </div>

                </Col>

                <Col lg={2} md={3} sm={4} className="game-info">
                    <h2>View History</h2>
                    <div>{moves}</div>
                    {this.renderCurrentBoard()}
                </Col>
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


function BoardButton(props) {
    return (
        <Button className="board-button" onClick={props.onClick}>
            {props.value}
        </Button>
    );
}