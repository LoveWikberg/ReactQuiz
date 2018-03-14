import React from 'react';
import { NotHost } from './notHost';
import { Host } from './host';
import '../index.css';
import './startScreen.css';
import { FacebookShareButton } from 'react-share';

export class StartScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
            inviteUrl: null
        };
    }

    componentWillMount = () => {
        this.createShareLink();
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

    encodeQueryData(data) {
        let ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

    createShareLink() {
        var data = { 'roomcode': this.props.roomCode };
        var querystring = this.encodeQueryData(data);
        var url = new URL(`https://dreamy-fermi-b142d0.netlify.com/?${querystring}`);
        this.setState({
            inviteUrl: url
        });
    }

    render() {
        return (
            <div>
                <FacebookShareButton
                    className="facebookShare"
                    url={this.state.inviteUrl}
                    children="Share on facebook"
                />
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


