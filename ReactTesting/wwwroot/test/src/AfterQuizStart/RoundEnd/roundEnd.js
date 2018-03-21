import React from 'react';
import { Score } from '../Score/score';

export class RoundEnd extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            timer: 7
        };
    }

    componentDidMount() {
        this.startTimer();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            timer: 7
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
            <div className="fadeInComponent">
                <h1>Current score</h1>
                <h4>The next round starts in {this.state.timer}</h4>
                <Score players={this.props.players} />
            </div>
        );
    }

}
