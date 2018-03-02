import React from 'react';
import { NotHost } from './notHost';
import { Host } from './host';
import { Table } from 'reactstrap';
import '../index.css';
import './startScreen.css';


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
        this.props.hubConnection.on("updatePlayerList", (players) => {
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
                <h1 className="startTitle" >Room {this.props.roomCode}</h1>
                {this.checkIfCreator()}
                <div className="playerContainer">
                {
                    this.state.players.map((player, key) => {
                            return (
                                <h5 key={key}>{player.name}</h5>
                        );
                    })
                }
                    </div>
            </div>
        );
    }
}


