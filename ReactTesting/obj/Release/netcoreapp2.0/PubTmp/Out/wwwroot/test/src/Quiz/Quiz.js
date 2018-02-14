import React from 'react';
import { Button } from 'reactstrap';
import {Alternative} from './alternative';

export class Quiz extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3>{this.props.question.category}</h3>
                <h1>{this.props.question.question}</h1>

                {
                    this.props.question.alternatives.map( (alt, index) => {
                        const color = (index % 2 === 0) ? "primary" : "secondary";
                        return (
                            <Alternative color={color} alt={alt} hubConnection={this.props.hubConnection}></Alternative>
                        );
                    })
                }
            </div>
        );
    }
}

