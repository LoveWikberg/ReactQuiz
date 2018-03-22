import React from 'react';
import { Progress } from 'reactstrap';
import { Alternative } from '../Alternative/alternative';
import './quiz.css';

export class Quiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: [],
            isDisabled: null,
            mainText: "",
            progress: 100,
            interval: null,
            progressColor: "info",
            altClass: ""
        };
    }

    componentWillMount() {
        this.setState({
            question: this.props.question,
            mainText: this.props.question.question,
            isDisabled: false
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

    componentWillReceiveProps(nextProps) {
        this.setState({
            mainText: nextProps.question.question,
            isDisabled: false,
            progressColor: "info",
            altClass: "slideFromRight"
        });

        var timeout = setTimeout(() => {
            this.setState({
                question: this.props.question,
                altClass: "slideFromLeft"
            });
            clearInterval(timeout);
        }, 500);

        var timeoutTwo = setTimeout(() => {
            this.setState({
                altClass: ""
            });
        }, 1000)

        this.moveProgressBar();
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
        }, 170);
        this.setState({
            interval: interval
        });
    }

    render() {
        return (
            <div className="fadeInComponent">
                <p className="category">{this.state.question.category}</p>
                <h5 className={`question `} onClick={(e) => console.log(e.target.className)}>{this.state.mainText}</h5>
                <Progress animated color={this.state.progressColor} value={this.state.progress} />
                <br />
                {
                    this.state.question.alternatives.map((alt, key) => {
                        return (
                            <Alternative
                                key={key}
                                alt={alt}
                                hubConnection={this.props.hubConnection}
                                roomCode={this.props.roomCode}
                                isDisabled={this.state.isDisabled}
                                disablebuttons={() => this.disableButtonsAndResetTimer()}
                                correctAnswer={this.state.question.correct_answer}
                                altClass={this.state.altClass}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

