import React from 'react';
import ReactDOM from 'react-dom';
import { MathQuiz } from './mathQuiz';


export class MathInstructions extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.props.hubConnection.on('startMathQuiz', (questions, players) => {
            ReactDOM.hydrate(
                <div className="tealGameContainer">
                    <MathQuiz
                        hubConnection={this.props.hubConnection}
                        questions={questions}
                        players={players}
                        roomCode={this.props.roomCode}
                        name={this.props.name}
                    />
                </div>
                , document.getElementById('root'));
        });

    }

    render() {
        return (
            <div>
                <h2>Mini game - math</h2>
                <h4>
                    You will soon be given a number of mathematical questions.
                Answer them as fast as you can.
                The first player to reach 15 correct answers will be given 3 points!
            </h4>
            </div>
        );
    }

}