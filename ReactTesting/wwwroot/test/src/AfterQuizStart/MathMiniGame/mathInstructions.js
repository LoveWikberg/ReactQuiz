import React from 'react';
import ReactDOM from 'react-dom';
import { MathQuiz } from './mathQuiz';
import './mathInstructions.css';


export class MathInstructions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            timer: 10,
            interval: null
        };
    }

    componentDidMount = () => {
        //this.setState({
        //    timer: 10
        //});
        this.interval();
        this.props.hubConnection.on('startMathQuiz', (questions, players) => {
            clearInterval(this.state.interval);
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

    interval() {
        var interval = setInterval(() => {
            let counter = this.state.timer;
            counter--;
            this.setState({
                timer: counter
            });
        }, 1000);
        this.setState({
            interval: interval
        });
    }

    render() {
        return (
            <div className="fadeInComponent">
                <h2 className="titleSpacing">Mini game - Math</h2>
                <h4>
                    You will soon be given a number of mathematical questions.
                Answer them as fast as you can.
                The first player to reach 15 correct answers will be given 3 points!
            </h4>
                <br />
                <h6>The Mini game starts in {this.state.timer}</h6>
            </div>
        );
    }

}