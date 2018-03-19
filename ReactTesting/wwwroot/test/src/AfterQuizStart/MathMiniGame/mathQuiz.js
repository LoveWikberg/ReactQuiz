import React from 'react';
import { Button, ButtonGroup, Progress } from 'reactstrap';
import './mathQuiz.css';

export class MathQuiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            questions: [],
            questionCount: 0
        };
    }

    componentWillMount = () => {
        console.log(this.props.questions);
        console.log(this.props.questions[this.state.questionCount]);
        this.setState({
            questions: this.props.questions,
            players: this.props.players,
            questionCount: 0
        });
    }

    componentDidMount = () => {
        this.props.hubConnection.on('updatePlayerProgres', (players) => {
            this.setState({
                players: players
            });
            console.log(this.state.players);
        });
        this.props.hubConnection.on('testwin', () => {
            alert("win!");
        });
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            questions: nextProps.questions,
            players: nextProps.players,
            questionCount: 0
        });
    }

    handleAnswer(e) {
        const correctAnswer = this.state.questions[this.state.questionCount].correct_answer;
        if (e.target.value === correctAnswer) {
            this.props.hubConnection.invoke('collectMathAnswer', this.props.roomCode)
        }
        let questionCount = this.state.questionCount;
        questionCount++;
        this.setState({
            questionCount: questionCount
        });
    }

    render() {
        return (
            <div>
                <h1>{this.state.questions[this.state.questionCount].question}</h1>
                <ButtonGroup className="btnGroupWidth btnGroupSpacing" size="lg">
                    {
                        this.state.questions[this.state.questionCount].alternatives
                            .map((alternative, key) => {
                                return (
                                    <Button
                                        onClick={(e) => this.handleAnswer(e)}
                                        className="matteBtnGroup"
                                        key={key}
                                        value={alternative}
                                    >
                                        {alternative}
                                    </Button>
                                );
                            })
                    }
                </ButtonGroup>
                {
                    this.state.players.map((player, key) => {
                        return (
                            <div>
                                <div key={key} className="text-center">{player.mathQuizScore}/15</div>
                                <Progress value={player.mathQuizScore * 6.66} />
                            </div>
                        );
                    })
                }
            </div >
        );
    }

}