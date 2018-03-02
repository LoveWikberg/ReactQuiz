import React from 'react';
import { Score } from './score';

export class RoundEnd extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            timer: 10
        };
    }

    componentDidMount() {
        this.startTimer();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            timer: 10
        });
        this.startTimer();
    }

    startTimer() {
        var time = this.state.timer;
        var interval = setInterval(() => {
            time--;
            this.setState({
                timer: time
            });
            if (time === 0)
                clearInterval(interval);
        }, 1000);
    }

    nextRound() {
        this.props.hubConnection.invoke('sendQuestion', this.props.roomCode);
    }

    render() {
        return (
            <div>
                <h1>Current score</h1>
                <p>The next round starts in {this.state.timer}</p>
                <Score players={this.props.players} />
            </div>
        );
    }

}
