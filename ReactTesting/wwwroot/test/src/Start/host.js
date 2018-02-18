import React from 'react';
import { Button } from 'reactstrap';

export class Host extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfQuestions: 9
        };
    }

    setNumberOfQuestions(e) {
        // TODO
        // Compare previous value to current value
        // This might not be needed
        this.setState({
            numberOfQuestions: e
        });
    }

    render() {
        return (
            <div>
                <h1>Hur många frågor?{this.state.numberOfQuestions}</h1>
                <input type="number" min="9" max="36"
                    onChange={(e) => this.setNumberOfQuestions(e.target.value)}
                    step="3"></input>
                <Button type="button" value="Start" onClick={() => this.startGame()} >Start</Button>
            </div>
        );
    }

}