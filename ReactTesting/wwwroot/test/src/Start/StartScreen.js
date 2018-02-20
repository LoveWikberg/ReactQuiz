import React from 'react';
import { NotHost } from './notHost';
import { Host } from './host';
import { Table } from 'reactstrap';


export class StartScreen extends React.Component {

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

    componentDidMount = () => {
        alert("componentDidMount");
        this.props.hubConnection.on("updatePlayerList", (players) => {
            alert("updatePlayerList");
            this.setState({
                players: players
            });
        });
    }

    startGame() {
        this.props.hubConnection.invoke('startGame', this.props.roomCode);
    }

    checkIfCreator = () => {
        if (this.props.isCreator) {
            return (
                <div>
                    <Host
                        hubConnection={this.props.hubConnection}
                        roomCode={this.props.roomCode}
                    />
                </div>
            );
        }
        else {
            return (
                <div>
                    <NotHost />
                </div>
            );
        }
    }
    render() {
        return (
            <div>
                <h3>Room Code: {this.props.roomCode}</h3>
                {this.checkIfCreator()}
                <Table>
                    <thead>
                        <tr>
                            <th>Player</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.players.map((player) => {
                                return (
                                    <tr>
                                        <td>{player.name}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}


