﻿import React from 'react';
import './score.css';
import FontAwesome from 'react-fontawesome';

export class Score extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: []
        };
    }

    componentWillMount = () => {
        this.setState({
            players: this.props.players
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            player: nextProps.players
        });
    }

    //Use this later for score animation
    // Indicate if player went up or down the table
    //componentDidUpdate = (prevProps, prevState) => {
    //    alert("componentDidUpdate Score");
    //    console.log("previoues: ", prevState);
    //    console.log("current: ", this.state.players);
    //}

    render() {
        return (
            <div>
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
                                        classname = "podium gold";
                                        trophy = "trophy";
                                    }
                                    else if (index === 1) {
                                        classname = "podium silver";
                                        trophy = "trophy";
                                    }
                                    else if (index === 2) {
                                        classname = "podium bronze";
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
                                            />
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