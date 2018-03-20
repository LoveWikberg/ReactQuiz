import React from 'react';
import { Button, ButtonGroup, Progress } from 'reactstrap';
import './mathQuiz.css';

export class MathQuiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            questions: [],
            questionCount: 0,
            disableButtons: false
        };
    }

    componentWillMount = () => {
        this.setState({
            questions: this.props.questions,
            players: this.props.players,
            questionCount: 0
        });
    }

    componentDidMount = () => {
        this.props.hubConnection.on('updatePlayerProgress', (players) => {
            this.setState({
                players: players
            });
        });
        this.props.hubConnection.on('showMathQuizWinner', (players) => {
            this.setState({
                players: players,
                disableButtons: true
            });
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

    printPlayers() {
        let classname;
        return this.state.players.map((player, key) => {
            if (player.name !== this.props.name) {
                classname = "";
                if (player.mathQuizScore >= 15)
                    classname = "slide";
                return (
                    <div className={classname}>
                        <div key={key} className="text-center">{player.name} {player.mathQuizScore}/15</div>
                        <Progress value={player.mathQuizScore * 6.66} />
                    </div>
                );
            }
        })
    }

    printSelf() {
        let classname = "";
        return this.state.players.map((player, key) => {
            if (player.name === this.props.name) {
                if (player.mathQuizScore >= 15)
                    classname = "slide";
                return (
                    <div className={classname}>
                        <div key={key} className="text-center">Your progress {player.mathQuizScore}/15</div>
                        <Progress value={player.mathQuizScore * 6.66} />
                    </div>
                );
            }
        })
    }

    render() {
        return (
            <div>
                {
                    this.printSelf()
                    //this.state.players.map((player, key) => {
                    //    if (player.name === this.props.name) {
                    //        return (
                    //            <div>
                    //                <div key={key} className="text-center">Your progress {player.mathQuizScore}/15</div>
                    //                <Progress value={player.mathQuizScore * 6.66} />
                    //            </div>
                    //        );
                    //    }
                    //})
                }
                <h1 className="questionSpacing">{this.state.questions[this.state.questionCount].question}</h1>
                <ButtonGroup className="btnGroupWidth btnGroupSpacing" size="lg">
                    {
                        this.state.questions[this.state.questionCount].alternatives
                            .map((alternative, key) => {
                                return (
                                    <Button
                                        disabled={this.state.disableButtons}
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
                    this.printPlayers()
                }
            </div >
        );
    }

}