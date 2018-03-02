import React from 'react';
import { Score } from './score';

export class GameEnd extends React.Component {

    render() {
        return (
            <div>
                <h2>
                    {this.props.endMessage}
                </h2>
                <Score players={this.props.players} />
            </div>
        );
    }

}