import React from 'react';
import { Button, Table } from 'reactstrap';

export class Score extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        players: []
        };
    }

    componentWillMount = () =>{
        alert("componentWillMount");
    this.setState({
        players: this.props.players
})
}

    nextRound(){
        alert("sendQuestion");
        this.props.hubConnection.invoke('sendQuestion');
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
                    <tbody>
                        {
                            this.state.players.map(function (player, index) {
                                console.log(player);
                                return (
                                    <tr>
                                        <th scope="row">{index+1 }</th>
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