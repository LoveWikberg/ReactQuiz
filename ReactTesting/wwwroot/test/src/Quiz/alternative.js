import React from 'react';
import { Button } from 'reactstrap';
import '../index.css';

export class Alternative extends React.Component {

    sendAnswer(e) {
        this.props.hubConnection.invoke("checkIfAllPlayersHaveAnswered", this.props.alt, this.props.roomCode);
    }

    render() {
        return (
            <Button
                className={this.props.color}
                size="lg"
                onClick={() => this.sendAnswer()}
                block
            >
                {this.props.alt}
            </Button>
        );
    }
}