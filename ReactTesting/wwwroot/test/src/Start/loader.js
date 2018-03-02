import React from 'react';
import FontAwesome from 'react-fontawesome';
import './loader.css';

export class Loader extends React.Component {

    render() {
        return (
            <div className="coverScreen">
                <div className="spinnerAndInfo">
                    <FontAwesome
                        name="spinner"
                        size="5x"
                        spin
                    ></FontAwesome>
                    <h2>{this.props.text}</h2>
                </div>
            </div>
        );
    }

}
