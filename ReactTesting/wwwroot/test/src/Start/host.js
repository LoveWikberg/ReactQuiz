import React from 'react';
import { Button } from 'reactstrap';
import '../index.css';
import './host.css';

export class Host extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfQuestions: 9
        };
    }

    setNumberOfQuestions(e) {
        this.setState({
            numberOfQuestions: e
        });
    }

    startGame() {
        this.props.hubConnection.invoke('startGame', this.state.numberOfQuestions, this.props.roomCode);
    }

    render() {
        //<h1 className="title">Hur många frågor?{this.state.numberOfQuestions}</h1>
        //<input type="number" min="9" max="36"
        //    onChange={(e) => this.setNumberOfQuestions(e.target.value)}
        //    step="3"></input>
        return (
            <div>
                <input className="rangeInput" type="range" min="9" max="39" step="3"/>
                <Button className="watermelonBtn" onClick={() => this.startGame()} block>Start</Button>
            </div>
        );
    }

}