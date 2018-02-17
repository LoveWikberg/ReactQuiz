import React from 'react';
import { Button, Input } from 'reactstrap';

export class JoinScreen extends React.Component {

    handleClick() {
        alert("love");
        this.prop.testsendprop();
    }

    render() {
        return (
            <div>
                <Input placeholder="User name" />
                <Input placeholder="Room code" />
                <Button onClick={() => this.handleClick()}>Test prop func</Button>
            </div>
        );
    }

}