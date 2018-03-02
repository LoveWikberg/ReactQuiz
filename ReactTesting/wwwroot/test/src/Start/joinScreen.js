﻿import React from 'react';
import { Button, Input } from 'reactstrap';
import '../index.css';
import './joinScreen.css';

export class JoinScreen extends React.Component {

    joinRoom() {
        if (this.props.name.length > 12)
            alert("Too long name - max 12 characters");
        else if (this.props.name.length === 0)
            alert("A name is needed");
        else
            this.props.hubConnection.invoke("joinRoom", this.props.name, this.props.roomCode);
    }

    createRoom() {
        if (this.props.name.length > 12)
            alert("Too long name - max 12 characters");
        else if (this.props.name.length === 0)
            alert("A name is needed");
        else
            this.props.hubConnection.invoke("createRoom", this.props.name);
    }

    changeName(e) {
        this.props.changeName(e.target.value);
    }

    changeRoomCode(e) {
        const roomCode = e.target.value.toUpperCase();
        this.props.changeRoomCode(roomCode);
    }

    render() {
        return (
            <div>
                <h1 className="title" >Quiz of Love</h1>

                <Input className="inputSpacing"
                    placeholder="User name (max 12 characters)"
                    onChange={(e) => this.changeName(e)}
                    max="12"
                />
                <Input className="inputSpacing "
                    placeholder="Room code"
                    value={this.props.roomCode}
                    onChange={(e) => this.changeRoomCode(e)}
                max="4"/>
                <Button className="watermelonBtn btnSpacing" onClick={() => this.joinRoom()} block>Join room</Button>
                <h4>Or...</h4>
                <Button className="matteBtn btnSpacing" onClick={() => this.createRoom()} block>Create room</Button>
            </div>
        );
    }

}