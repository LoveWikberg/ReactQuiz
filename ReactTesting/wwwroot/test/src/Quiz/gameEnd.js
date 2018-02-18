import React from 'react';
import { Button, Table } from 'reactstrap';

export class GameEnd extends React.Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h2>
                    {this.props.endMessage}
                </h2>
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
                            this.props.players.map(function (player, index) {
                                console.log(player);
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
            </div>
        );
    }

}