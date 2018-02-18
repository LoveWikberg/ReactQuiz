import React from 'react';
import { NotHost } from './notHost';
import { Host } from './host';


export class StartScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numberOfQuestions: 10
        };
    }

    setNumberOfQuestions(value) {
        this.setState({
            numberOfQuestions: value
        });
    }

    startGame() {
        this.props.hubConnection.invoke('startGame', this.state.numberOfQuestions);
        alert(this.state.numberOfQuestions);
    }

    checkIfCreator = () => {
        if (this.props.isCreator) {
            return (
                <div>
                    <Host />
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
        //<h1>Hur många frågor?</h1>
        //<input type="number" min="3" max="25" value={this.state.numberOfQuestions}
        //    onChange={e => this.setNumberOfQuestions(e.target.value)} ></input>
        //<input type="button" value="Start" onClick={() => this.startGame()} ></input>
        return (
            <div>
                <h3>Room Code: {this.props.roomCode}</h3>
                {this.checkIfCreator()}
            </div>
        );
    }
}


