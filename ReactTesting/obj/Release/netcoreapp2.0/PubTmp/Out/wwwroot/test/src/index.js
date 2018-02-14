import React from 'react';
import ReactDOM from 'react-dom';
import { HubConnection } from '@aspnet/signalr-client';
import './index.css';
import { Quiz } from './Quiz/Quiz.js';
import { StartScreen } from './Start/StartScreen';
import { Score } from './Quiz/score';
//import 'bootstrap/dist/css/bootstrap.css';
import '../node_modules/reactstrap/dist/reactstrap.cjs'

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            hubConnection: null,
            players: [],
            testname: "hej"
        };
    }

    componentDidMount = () => {
        const nick = window.prompt('Your name:', 'John');
        const hubConnection = new HubConnection('http://localhost:50083/quiz');

        this.setState({ hubConnection, nick }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log("connected"))
                .catch(err => console.log('Error while establishing connection :('));

            this.state.hubConnection.on('sendQuestion', (question) => {
                console.log(question);
                this.renderQuestion(question);
            });

            this.state.hubConnection.on('showAnswers', (players) => {
                this.renderScoreBoard(players);
            });
        });
    }

   

    addPlayer() {
        this.state.hubConnection.invoke('addPlayer', this.state.nick);
        alert("added player");
    }

    resetAll(){
    this.state.hubConnection.invoke('resetGame');
        alert("Reseted");
}

    renderStartScreen() {
        // Use this instead of reactDOm.render()
        //ReactDOM.hydrate(element, container[, callback])
    }

    renderScoreBoard(players) {
                //<Score players={this.state.players} />
        ReactDOM.hydrate(
            <div>
                <Score players={players} hubConnection={this.state.hubConnection} />
            </div>
            , document.getElementById('root'));
    }

    renderQuestion(question) {
        ReactDOM.hydrate(
            <div>
                <Quiz question={question} hubConnection={this.state.hubConnection}/>
            </div>
            , document.getElementById('root'));
    }

    render() {
        return (
            <div>
                <button onClick={() => this.addPlayer()} >Connect</button>
                <button onClick={() => this.resetAll()} >Reset all</button>
                < StartScreen hubConnection={this.state.hubConnection} />
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);




//class StartScreen extends React.Component {
//    constructor(props) {
//        super(props);

//        this.state = {
//            numberOfQuestions: 10
//        };
//    }

//    setNumberOfQuestions(value) {
//        this.setState({
//            numberOfQuestions: value
//        });
//    }

//    startGame() {
//        this.props.hubConnection.invoke('startGame', this.state.numberOfQuestions);
//        alert(this.state.numberOfQuestions);
//    }

//    render() {
//        return (
//            <div>
//                <h1>Hur många frågor?</h1>
//                <input type="number" min="10" max="25" value={this.state.numberOfQuestions}
//                    onChange={e => this.setNumberOfQuestions(e.target.value)} ></input>
//                <input type="button" value="Start" onClick={() => this.startGame()} ></input>
//            </div>
//        );
//    }
//}

//class Quiz extends React.Component {
//    constructor(props) {
//        super(props);
//        this.state = {
//            question: '',
//            correctAnswer: '',
//            difficulty: '',
//            alternatives: []
//        };
//    }
//    componentWillMount() {
//        this.setState({
//            question: this.props.question.question,
//            correctAnswer: this.props.question.correct_answer,
//            difficulty: this.props.question.difficulty,
//            alternatives: this.props.question.alternatives
//        });
//    }
//    testalert() {
//        alert("trycket");
//        console.log(this.props.question);
//    }

//    render() {
//        return (
//            <div>
//                <h1></h1>
//                <input type="button" value="log" onClick={() => this.testalert()} />
//            </div>
//        );
//    }
//}

//class Board extends React.Component {
//    constructor(props) {
//        super(props);
//        this.state = {
//            squares: Array(9).fill(null),
//            xIsNext: true
//        };
//    }

//    handleClick(i) {
//        const squares = this.state.squares.slice();
//        if (calculateWinner(squares) || squares[i]) {
//            return;
//        }
//        squares[i] = this.state.xIsNext ? 'X' : 'O';
//        this.setState({
//            squares: squares,
//            xIsNext: !this.state.xIsNext
//        });
//    }

//    renderSquare(i) {
//        return (
//            <Square
//                value={this.state.squares[i]}
//                onClick={() => this.handleClick(i)}
//            />
//        );
//    }

//    render() {
//        const winner = calculateWinner(this.state.squares);
//        let status;
//        if (winner) {
//            status = 'Winner: ' + winner;
//        } else {
//            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//        }

//        return (
//            <div>
//                <div className="status">{status}</div>
//                <div className="board-row">
//                    {this.renderSquare(0)}
//                    {this.renderSquare(1)}
//                    {this.renderSquare(2)}
//                </div>
//                <div className="board-row">
//                    {this.renderSquare(3)}
//                    {this.renderSquare(4)}
//                    {this.renderSquare(5)}
//                </div>
//                <div className="board-row">
//                    {this.renderSquare(6)}
//                    {this.renderSquare(7)}
//                    {this.renderSquare(8)}
//                </div>
//            </div>
//        );
//    }
//}

//function Square(props) {
//    return (
//        <button className="square" onClick={props.onClick}>
//            {props.value}
//        </button>
//    );
//}

//function calculateWinner(squares) {
//    const lines = [
//        [0, 1, 2],
//        [3, 4, 5],
//        [6, 7, 8],
//        [0, 3, 6],
//        [1, 4, 7],
//        [2, 5, 8],
//        [0, 4, 8],
//        [2, 4, 6]
//    ];
//    for (let i = 0; i < lines.length; i++) {
//        const [a, b, c] = lines[i];
//        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//            return squares[a];
//        }
//    }
//    return null;
//}
