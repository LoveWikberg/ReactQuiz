import React from 'react';

export class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            correctAnswer: '',
            difficulty: '',
            category: '',
            alternatives: []
        };
    }
    componentWillMount() {
        this.setState({
            question: this.props.question.question,
            correctAnswer: this.props.question.correct_answer,
            difficulty: this.props.question.difficulty,
            category: this.props.question.category,
            alternatives: this.props.question.alternatives
        });
    }
    testalert() {
        alert("trycket");
        console.log(this.props.question);
        console.log(this.state.alternatives);
    }

    render() {
        return (
            <div>
                <h3>{this.state.category}</h3>
                <h1>{this.state.question}</h1>
                <input type="button" value="log" onClick={() => this.testalert()} />
            </div>
        );
    }
}

