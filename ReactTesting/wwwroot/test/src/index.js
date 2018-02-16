﻿import React from 'react';
import ReactDOM from 'react-dom';
//import { HubConnection } from '@aspnet/signalr-client';
import { HubConnection } from '@aspnet/signalr-client/dist/browser/signalr-clientES5-1.0.0-alpha2-final.js'
import './index.css';
import { Quiz } from './Quiz/Quiz.js';
import { StartScreen } from './Start/StartScreen';
import { Score } from './Quiz/score';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'reactstrap';

//This is for setting.json
//"homepage": "http://lowwick-001-site1.itempurl.com/",

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            hubConnection: null,
            players: [],
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

    resetAll() {
        this.state.hubConnection.invoke('resetGame');
        alert("Reseted");
    }

    renderStartScreen() {
        // Use this instead of reactDOm.render()
        //ReactDOM.hydrate(element, container[, callback])
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

    render() {
        return (
            <Container>
                <Row>
                    <Col sm={{ size: 8, order: 2, offset: 1 }}>
                        <button onClick={() => this.addPlayer()} >Connect</button>
                        <button onClick={() => this.resetAll()} >Reset all</button>
                        < StartScreen hubConnection={this.state.hubConnection} />
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
