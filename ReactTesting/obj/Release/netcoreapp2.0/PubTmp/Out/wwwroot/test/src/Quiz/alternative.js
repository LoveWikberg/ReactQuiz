import React from 'react';
import { Button } from 'reactstrap';

export class Alternative extends React.Component {

        sendAnswer(e) {
            this.props.hubConnection.invoke("checkIfAllPlayersHaveAnswered", this.props.alt);
        alert("sending answer: " + this.props.alt);
}

    render()
    {
        return (
                <Button color={this.props.color} size="lg" block
                onClick={() => this.sendAnswer()} >{this.props.alt}</Button>
            );
}
}