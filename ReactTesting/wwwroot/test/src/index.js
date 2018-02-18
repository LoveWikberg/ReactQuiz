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
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'reactstrap';

//This is for setting.json
//"homepage": "http://lowwick-001-site1.itempurl.com/",

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            hubConnection: null,
            players: [],
            roomCode: ''
        };
    }

    componentWillMount = () => {
        const hubConnection = new HubConnection('http://localhost:50083/quiz');

        this.setState({ hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log("connected"))
                .catch(err => console.log('Error while establishing connection :(', err));

            this.state.hubConnection.on('sendQuestion', (question) => {
                console.log(question);
                this.renderQuestion(question);
            });
            this.state.hubConnection.on('showStartScreen', (isCreator, roomCode) => {
                alert("showStartScreen");
                this.setState({
                    roomCode: roomCode
                });
                this.renderStartScreen(isCreator);
            });
            this.state.hubConnection.on("connectionFail", () => {
                alert("connedction failed");
            })
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

    addPlayer() {
        this.state.hubConnection.invoke('addPlayer', this.state.name);
        alert("added player");
    }

    resetAll() {
        this.state.hubConnection.invoke('resetGame')
            .then(() => alert("reseted"))
            .catch(() => alert("reset failed"));
    }

    renderGameEnd(players, endMessage) {
        ReactDOM.hydrate(
            <Container>
                <Row>
                    <Col sm={{ size: 8, order: 2, offset: 1 }}>
                        <GameEnd endMessage={endMessage} players={players} />
                    </Col>
                </Row>
            </Container>
            , document.getElementById('root'));
    }

    renderStartScreen(isCreator) {
        ReactDOM.hydrate(
            <Container>
                <Row>
                    <Col sm={{ size: 8, order: 2, offset: 1 }}>
                        <StartScreen
                            isCreator={isCreator}
                            roomCode={this.state.roomCode}
                        />
                    </Col>
                </Row>
            </Container>
            , document.getElementById('root'));
    }

    renderScoreBoard(players) {
        ReactDOM.hydrate(
            <Container>
                <Row>
                    <Col sm={{ size: 8, order: 2, offset: 1 }}>
                        <Score players={players} hubConnection={this.state.hubConnection} />
                    </Col>
                </Row>
            </Container>
            , document.getElementById('root'));
    }

    renderQuestion(question) {
        ReactDOM.hydrate(
            <Container>
                <Row>
                    <Col sm={{ size: 8, order: 2, offset: 1 }}>
                        <Quiz question={question} hubConnection={this.state.hubConnection} />
                    </Col>
                </Row>
            </Container>
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
            <Container>
                <input type="button" value="reset" onClick={() => this.resetAll()} />
                <Row>
                    <Col sm={{ size: 8, order: 2, offset: 1 }}>
                        <JoinScreen
                            changeName={this.changeName}
                            changeRoomCode={this.changeRoomCode}
                            hubConnection={this.state.hubConnection}
                            name={this.state.name}
                            roomCode={this.state.roomCode} />
                    </Col>
                </Row>
            </Container>
        );
    }
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
