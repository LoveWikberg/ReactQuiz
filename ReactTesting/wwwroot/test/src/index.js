import React from 'react';
import ReactDOM from 'react-dom';
import { HubConnection } from '@aspnet/signalr-client/dist/browser/signalr-clientES5-1.0.0-alpha2-final.js';
import { Quiz } from './AfterQuizStart/Quiz/Quiz';
import { RoundEnd } from './AfterQuizStart/RoundEnd/roundEnd';
import { GameEnd } from './AfterQuizStart/GameEnd/gameEnd';
import { StartScreen } from './BeforeQuizStart/StartScreen/startScreen';
import { JoinScreen } from './BeforeQuizStart/JoinScreen/joinScreen';
import { Loader } from './BeforeQuizStart/Loader/loader';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';


class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            hubConnection: null,
            players: [],
            roomCode: '',
            showLoader: true,
            loaderText: "Connecting to the server",
            hostname: window && window.location && window.location.hostname
        };
    }

    componentDidMount = () => {
        //const hostname = window && window.location && window.location.hostname;
        let backendHost;

        if (this.state.hostname === 'localhost') {
            backendHost = 'http://localhost:50083/quiz';
        }
        else {
            backendHost = 'https://quizoflove.azurewebsites.net/quiz';
        }

        const hubConnection = new HubConnection(backendHost);

        this.setState({ hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => this.connected())
                .catch(err => this.connectionFailed());

            this.state.hubConnection.on('sendQuestion', (question) => {
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
                alert("The room doesn't excist or is full");
            });
            this.state.hubConnection.on('showAnswers', (players) => {
                this.renderCurrentScore(players);
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
            this.state.hubConnection.on('disalert', () => {
                alert("disconnected");
            });
        });
    }

    encodeQueryData(data) {
        let ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

    connected() {
        console.log("connected");
        this.setState({
            showLoader: false
        });

        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('roomcode')) {
            const code = urlParams.get('roomcode');
            this.setState({
                roomCode: code
            });
        }
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
                    hostname={this.state.hostname}
                />
            </div>
            , document.getElementById('root'));
    }

    renderCurrentScore(players) {
        ReactDOM.hydrate(
            <div className="tealGameContainer">
                <RoundEnd
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

    onFacebookLogin = (loginStatus, resultObject) => {
        // Remove whitespaces
        //var name = resultObject.user.name.replace(/ /g, '');
        var name = resultObject.user.name.split(" ");
        if (loginStatus === true) {
            this.setState({
                name: name[0]
            });
        } else {
            alert('Facebook login error');
        }
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
                        onLogin={this.onFacebookLogin}
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
