import React from 'react';
import ReactDOM from 'react-dom';
//import { HubConnection } from '@aspnet/signalr-client';
import { HubConnection } from '@aspnet/signalr-client/dist/browser/signalr-clientES5-1.0.0-alpha2-final.js';
import './index.css';
import { Quiz } from './Quiz/Quiz.js';
import { StartScreen } from './Start/startScreen';
import { JoinScreen } from './Start/joinScreen';
import { Score } from './Quiz/score';
import { GameEnd } from './Quiz/gameEnd';
import { Loader } from './Start/loader';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'reactstrap';
//import FontAwesome from 'react-fontawesome';


class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            hubConnection: null,
            players: [],
            roomCode: '',
            showLoader: true,
            loaderText: "Connecting to server"
        };
    }

    componentDidMount = () => {
        const hostname = window && window.location && window.location.hostname;
        let backendHost;

        if (hostname === 'localhost') {
            backendHost = 'http://localhost:50083/quiz';
        }
        else {
            backendHost = 'https://lovequiz.azurewebsites.net/quiz';
        }

        const hubConnection = new HubConnection(backendHost);

        this.setState({ hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => this.connected())
                .catch(err => this.connectionFailed());

            this.state.hubConnection.on('sendQuestion', (question) => {
                //console.log(question);
                this.renderQuestion(question);
            });
            this.state.hubConnection.on('showStartScreen', (isCreator, roomCode, players) => {
                this.setState({
                    roomCode: roomCode,
                    players: players
                });
                this.renderStartScreen(isCreator);
            });
            this.state.hubConnection.on("connectionFail", () => {
                alert("The room don't excist or is full");
            });
            this.state.hubConnection.on('showAnswers', (players) => {
                this.renderScoreBoard(players);
            });
            this.state.hubConnection.on('gameDraw', (players, drawers) => {
                var endMessage = "And the winner is... there is no winner. It's a draw between";
                for (var i = 0; i < drawers.length; i++) {
                    if (i === drawers.length - 2)
                        endMessage += " " + drawers[i];
                    else if (i === drawers.length - 1)
                        endMessage += " and " + drawers[i];
                    else
                        endMessage += " " + drawers[i] + ",";
                }
                this.renderGameEnd(players, endMessage);
            });
            this.state.hubConnection.on('gameWon', (players, winner) => {
                this.renderGameEnd(players, "And the winner is... " + winner);
            });
        });
    }

    connected() {
        console.log("connected");
        this.setState({
            showLoader: false
        });
    }

    connectionFailed() {
        console.log('Error while establishing connection :(');
        this.setState({
            loaderText: "Could not establish a connection to the server, please reload the page"
        });
    }

    addPlayer() {
        this.state.hubConnection.invoke('addPlayer', this.state.name);
    }

    resetAll() {
        this.state.hubConnection.invoke('resetGame')
            .then(() => alert("reseted"))
            .catch(() => alert("reset failed"));
    }

    renderGameEnd(players, endMessage) {
        ReactDOM.hydrate(
            <div className="tealGameContainer">
                <GameEnd endMessage={endMessage} players={players} />
            </div>
            , document.getElementById('root'));
    }

    renderStartScreen(isCreator) {
        ReactDOM.hydrate(
            <div className="tealGameContainer">
                <StartScreen
                    isCreator={isCreator}
                    roomCode={this.state.roomCode}
                    hubConnection={this.state.hubConnection}
                    players={this.state.players}
                />
            </div>
            , document.getElementById('root'));
    }

    renderScoreBoard(players) {
        ReactDOM.hydrate(
            <div className="tealGameContainer">
                <Score
                    players={players}
                    roomCode={this.state.roomCode}
                    hubConnection={this.state.hubConnection}
                />
            </div>
            , document.getElementById('root'));
    }

    renderQuestion(question) {
        ReactDOM.hydrate(
            <div className="tealGameContainer">
                <Quiz
                    question={question}
                    hubConnection={this.state.hubConnection}
                    roomCode={this.state.roomCode}
                />
            </div>
            , document.getElementById('root'));
    }

    changeName = (name) => {
        this.setState({
            name: name
        });
    }

    changeRoomCode = (code) => {
        this.setState({
            roomCode: code
        });
    }

    render() {
        return (
            <div>
                {this.state.showLoader ? <Loader text={this.state.loaderText} /> : null}
                <div className="tealGameContainer">
                    <JoinScreen
                        changeName={this.changeName}
                        changeRoomCode={this.changeRoomCode}
                        hubConnection={this.state.hubConnection}
                        name={this.state.name}
                        roomCode={this.state.roomCode}
                    />
                </div>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
