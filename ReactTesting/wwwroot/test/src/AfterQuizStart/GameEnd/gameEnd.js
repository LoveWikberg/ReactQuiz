import React from 'react';
import { Score } from '../Score/score';
import { Button } from 'reactstrap';
import './gameEnd.css';
import '../../index.css';

export class GameEnd extends React.Component {



    render() {
        return (
            <div className="fadeInComponent">
                <h2>
                    {this.props.endMessage}
                </h2>
                <Score players={this.props.players} />
                <Button
                    className="watermelonBtn buttonSpacing"
                    onClick={() => window.location.reload()}
                    block
                >
                    Play again!
                    </Button>
            </div>
        );
    }

}