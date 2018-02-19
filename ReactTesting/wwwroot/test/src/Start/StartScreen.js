import React from 'react';
import { NotHost } from './notHost';
import { Host } from './host';


export class StartScreen extends React.Component {
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
            </div>
        );
    }
}


