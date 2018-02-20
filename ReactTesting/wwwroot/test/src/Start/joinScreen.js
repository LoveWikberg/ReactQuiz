import React from 'react';
import { Button, Input } from 'reactstrap';
import '../index.css';
import './joinScreen.css';

export class JoinScreen extends React.Component {

    joinRoom() {
        this.props.hubConnection.invoke("joinRoom", this.props.name, this.props.roomCode);
    }

    createRoom() {
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
                <h1 className="title" >Quiz of Love</h1>

                <Input className="inputSpacing" placeholder="User name" onChange={(e) => this.changeName(e)} />
                <Input className="inputSpacing " placeholder="Room code" onChange={(e) => this.changeRoomCode(e)} />
                <Button className="watermelonBtn btnSpacing" onClick={() => this.joinRoom()} block>Join room</Button>
                <h4>Or...</h4>
                <Button className="matteBtn btnSpacing" onClick={() => this.createRoom()} block>Create room</Button>
            </div>
        );
    }

}