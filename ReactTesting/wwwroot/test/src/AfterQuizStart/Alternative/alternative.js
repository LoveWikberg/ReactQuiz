import React from 'react';
import { Button } from 'reactstrap';
import '../../index.css';
import './alternative.css';

export class Alternative extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            btnClass: "matteBtn"
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isDisabled === false) {
            this.setState({
                btnClass: "matteBtn"
            });
        }
    }

    sendAnswer(e) {
        if (this.props.alt === this.props.correctAnswer) {
            this.setState({
                btnClass: "greenBtn"
            });
        }
        else {
            this.setState({
                btnClass: "watermelonBtn"
            });
        }
        this.props.disablebuttons();
        this.props.hubConnection.invoke("collectAnswer", this.props.alt, this.props.roomCode);
    }

    render() {
        return (
            <Button
                className={this.state.btnClass}
                size="lg"
                onClick={() => this.sendAnswer()}
                disabled={this.props.isDisabled}
                block
            >
                <span className="breakLine">
                    {this.props.alt}
                </span>
            </Button>
        );
    }
}