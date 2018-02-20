import React from 'react';
import { Button, Table } from 'reactstrap';

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

    //Use this later for score animation
    componentDidUpdate = (prevProps, prevState) => {
        alert("componentDidUpdate");
        console.log("previoues: ", prevState);
        console.log("current: ", this.state.players);
    }

    nextRound() {
        this.props.hubConnection.invoke('sendQuestion', this.props.roomCode);
    }

    render() {
        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody className="niceShuffle">
                        {
                            this.state.players.map(function (player, index) {
                                return (
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{player.name}</td>
                                        <td>{player.points}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
                <Button onClick={() => this.nextRound()}>Next Round</Button>
            </div>
        );
    }
}