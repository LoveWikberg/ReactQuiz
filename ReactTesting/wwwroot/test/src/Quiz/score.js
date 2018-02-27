import React from 'react';
import { Button, Table } from 'reactstrap';
import './score.css';
import FontAwesome from 'react-fontawesome';

export class Score extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            timer: 10
        };
    }


    componentWillMount = () => {
        this.setState({
            players: this.props.players
        });
    }

    componentDidMount() {
        this.startTimer();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            player: nextProps.players,
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
            if (time == 0)
                clearInterval(interval);
        }, 1000);
    }

    //Use this later for score animation
    // Indicate if player went up or down the table
    //componentDidUpdate = (prevProps, prevState) => {
    //    alert("componentDidUpdate Score");
    //    console.log("previoues: ", prevState);
    //    console.log("current: ", this.state.players);
    //}

    nextRound() {
        this.props.hubConnection.invoke('sendQuestion', this.props.roomCode);
    }

    render() {
        return (
            <div>
                <h1>Current score</h1>
                <p>The next round starts in {this.state.timer}</p>
                <table>
                    <thead>
                        <tr id="head">
                            <th>#</th>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.players.map(function (player, index) {
                                {
                                    var classname = "";
                                    var trophy = "";
                                    if (index === 0) {
                                        classname = "podium gold"
                                        trophy = "trophy";
                                    }
                                    else if (index === 1) {
                                        classname = "podium silver"
                                        trophy = "trophy";
                                    }
                                    else if (index === 2) {
                                        classname = "podium bronze"
                                        trophy = "trophy";
                                    }
                                }
                                return (
                                    <tr>
                                        <th>
                                            {index + 1}
                                            <FontAwesome
                                                name={trophy}
                                                className={classname}
                                            ></FontAwesome>
                                        </th>
                                        <td>{player.name}</td>
                                        <td>{player.points}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
                //<Table>
                //    <thead>
                //        <tr>
                //            <th>#</th>
                //            <th>Player</th>
                //            <th>Score</th>
                //        </tr>
                //    </thead>
                //    <tbody className="niceShuffle">
                //        {
                //            this.state.players.map(function (player, index) {
                //                return (
                //                    <tr>
                //                        <th scope="row">{index + 1}</th>
                //                        <td>{player.name}</td>
                //                        <td>{player.points}</td>
                //                    </tr>
                //                );
                //            })
                //        }
                //    </tbody>
                //</Table>
                //<Button onClick={() => this.nextRound()}>Next Round</Button>