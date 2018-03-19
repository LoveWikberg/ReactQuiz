import React from 'react';
import { Progress } from 'reactstrap';
import { Alternative } from '../Alternative/alternative';
import './quiz.css';

export class Quiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisabled: null,
            mainText: "",
            progress: 100,
            interval: null,
            progressColor: "info"
        };
    }

    componentWillMount() {
        this.setState({
            mainText: this.props.question.question,
            isDisabled: false
        });
        this.moveProgressBar();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mainText: nextProps.question.question,
            isDisabled: false,
            progressColor: "info"
        });
        this.moveProgressBar();
    }

    componentDidMount = () => {
        this.props.hubConnection.on("nextQuestion", () => {
            this.setState({
                mainText: "Next question is comming up!"
            });
        });
    }

    disableButtonsAndResetTimer = () => {
        clearInterval(this.state.interval);
        this.setState({
            isDisabled: true,
            mainText: "Waiting for other players",
            progress: 100
        });
    }

    moveProgressBar = () => {
        var progress;
        
        var interval = setInterval(() => {
            progress = this.state.progress - 1;
            this.setState({
                progress: progress
            });
            if (this.state.progress === 0) {
                this.setState({
                    progressColor: "danger"
                });

                this.disableButtonsAndResetTimer();
                this.props.hubConnection.invoke("collectAnswer", " ", this.props.roomCode);
            }
        }, 150);
        this.setState({
            interval: interval
        });
    }

    render() {
        return (
            <div>
                <p className="category">{this.props.question.category}</p>
                <h5 className="question">{this.state.mainText}</h5>
                <Progress animated color={this.state.progressColor} value={this.state.progress} />
                <br />
                {
                    this.props.question.alternatives.map((alt, key) => {
                        return (
                            <Alternative
                                key={key}
                                alt={alt}
                                hubConnection={this.props.hubConnection}
                                roomCode={this.props.roomCode}
                                isDisabled={this.state.isDisabled}
                                disablebuttons={() => this.disableButtonsAndResetTimer()}
                                correctAnswer={this.props.question.correct_answer}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

