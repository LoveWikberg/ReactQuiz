import React from 'react';
import { Button } from 'reactstrap';
import { Alternative } from './alternative';
import './quiz.css';

export class Quiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisabled: null,
            mainText: ""
        };
    }

    componentDidMount(){
        this.setState({
            mainText: this.props.question.question,
            isDisabled: false
        });
}

    componentWillReceiveProps(nextProps) {
        this.setState({
            mainText: nextProps.question.question,
            isDisabled: false
        });
    }


    disableButtons = () => {
        this.setState({
            isDisabled: true,
            mainText: "Waiting for other players"
        });
    }

    render() {
                //<h5 className="question">{this.props.question.question}</h5>
        return (
            <div>
                <p className="category">{this.props.question.category}</p>
                <h5 className="question">{this.state.mainText}</h5>
                {
                    this.props.question.alternatives.map((alt, index) => {
                        return (
                            <Alternative
                                alt={alt}
                                hubConnection={this.props.hubConnection}
                                roomCode={this.props.roomCode}
                                isDisabled={this.state.isDisabled}
                                disablebuttons={() => this.disableButtons()}
                                correctAnswer={this.props.question.correct_answer}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

