import React from 'react';
import { Button } from 'reactstrap';
import '../../index.css';
import './host.css';
import axios from 'axios';

export class Host extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfQuestions: 24,
            quiznames: [],
            selectedQuiz: null
        };
    }

    componentDidMount() {
        this.getQuiznames();
    }

    getQuiznames() {
        let apiUrl = "";
        if (this.props.hostname === 'localhost') {
            apiUrl = 'http://localhost:50083/api/quiz/quiznames';
        }
        else {
            apiUrl = 'https://quizoflove.azurewebsites.net/api/quiz/quiznames';
        }
        axios.get(apiUrl)
            .then((response) => {
                this.setState({
                    quiznames: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    setSelectedQuiz(e) {
        this.setState({
            selectedQuiz: e.target.value
        });
    }

    setNumberOfQuestions(e) {
        this.setState({
            numberOfQuestions: e
        });
    }

    startGame() {
        this.props.hubConnection
            .invoke('startGame', this.state.numberOfQuestions, this.props.roomCode, this.state.selectedQuiz)
            .catch(() => {
                alert("An error occured when you tried to start the game. Please try again or reload the page and create a new room.");
            });
    }

    render() {
        return (
            <div>
                <h3>Questions: {this.state.numberOfQuestions}</h3>
                <input type="range" min="9" max="39" step="3"
                    defaultValue="24"
                    onChange={(e) => this.setNumberOfQuestions(e.target.value)}
                />
                <select className="customSelect" onChange={(e) => this.setSelectedQuiz(e)}>
                    <option disabled selected>Select a quiz</option>
                    <option value="standard" >Standard quiz</option>
                    {
                        this.state.quiznames.map((name, key) => {
                            return (
                                <option
                                    key={key}
                                    value={name}
                                >
                                    {name}
                                </option>
                            );
                        })
                    }
                </select>
                <Button className="watermelonBtn" onClick={() => this.startGame()} block>Start</Button>
            </div>
        );
    }

}