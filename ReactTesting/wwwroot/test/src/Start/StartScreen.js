import React from 'react';

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

    render() {
        return (
            <div>
                <h1>Hur många frågor?</h1>
                <input type="number" min="3" max="25" value={this.state.numberOfQuestions}
                    onChange={e => this.setNumberOfQuestions(e.target.value)} ></input>
                <input type="button" value="Start" onClick={() => this.startGame()} ></input>
            </div>
        );
    }
}
