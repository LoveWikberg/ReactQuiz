import React from 'react';
import { Button, Input } from 'reactstrap';

export class JoinScreen extends React.Component {

    joinRoom() {
        alert("join " + this.props.name);
        this.props.hubConnection.invoke("joinRoom", this.props.name, this.props.roomCode);
    }

    createRoom() {
        alert("create " + this.props.name);
        this.props.hubConnection.invoke("createRoom", this.props.name);
    }

    changeName (e) {
        this.props.changeName(e.target.value);
    }

    changeRoomCode(e) {
        this.props.changeRoomCode(e.target.value);
    }

    render() {
        return (
            <div>
                <Input placeholder="User name" onChange={(e) => this.changeName(e)} />
                <Input placeholder="Room code" onChange={(e) => this.changeRoomCode(e)} />
                <Button color="primary" onClick={() => this.joinRoom()}>Join room</Button>
                <Button color="success" onClick={() => this.createRoom()}>Create room</Button>
            </div>
        );
    }

}