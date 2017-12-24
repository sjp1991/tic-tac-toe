import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.className} onClick={props.onClick} id={props.id}>
            {props.value}
        </button>
    );
}

export default class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                className={'square sq'+ i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                id={'square' + this.props.squares[i]}
            />
        );
    }

    render() {
        return (
            <div className="square-container">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
            </div>
        );
    }
}