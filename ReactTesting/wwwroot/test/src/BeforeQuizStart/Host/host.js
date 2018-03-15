import React from 'react';
import { Button } from 'reactstrap';
import '../../index.css';
import './host.css';

export class Host extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfQuestions: 24
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
        return (
            <div>
                <h3>Questions: {this.state.numberOfQuestions}</h3>
                <input type="range" min="9" max="39" step="3"
                    defaultValue="24"
                    onChange={(e) => this.setNumberOfQuestions(e.target.value)}
                />
                <Button className="watermelonBtn" onClick={() => this.startGame()} block>Start</Button>
            </div>
        );
    }

}