import React, { useState } from "react";
import UserService from "../services/UserService";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;


class UserComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
        this.crDelUserTest = this.crDelUserTest.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        UserService.getUsers().then((response) => {
            this.setState({ users: response.data });
        });
        if (!stompClient) {
            let Sock = new SockJS('http://localhost:8083/ws');
            stompClient = over(Sock);
            stompClient.connect({}, this.onConnected, this.onError);
        }
    }

    onConnected = () => {
        stompClient.subscribe('/chatroom', this.onMessageReceived);
        this.userJoin();
    }

    onError = (err) => {
        console.log(err);
    }

    render() {
        return (
            <div>
                <h1 className="text-center">Queue Express</h1>
                <button onClick={this.crDelUserTest}>Join/Leave Queue</button>
                <table className="table table-striped" id="usersTable">
                    <thead>
                        <tr>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map(
                                user =>
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.queue_Num}</td>
                                    </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    crDelUserTest(){
        var login = "Harry"
        var max = 0;
        var needId = 12345;
        var position = 0;
        this.state.users.map(
            user => {
                if (user.name === login) {
                    needId = user.id;
                    position = user.queue_Num;
                }
                if (max < user.queue_Num) max = user.queue_Num
            }
        )
        if (needId === 12345){
            var user = {name : login, queue_Num: max + 1};
            UserService.createUser(user);
        }
        else{
            UserService.deleteUser(needId);
            this.state.users.map(
                user => {
                    if (user.queue_Num > position) {
                        user.queue_Num = user.queue_Num - 1;
                        UserService.updateUser(user, user.id);
                    }
                }
            )
        }
        this.updateQueue();
    }

    logOut(){
        var login = "Harry"
        var needId = 12345;
        var position = 0;
        this.state.users.map(
            user => {
                if (user.name === login) {
                    needId = user.id;
                    position = user.queue_Num;
                }
            }
        )
        if (!needId === 12345){
            UserService.deleteUser(needId);
            this.state.users.map(
                user => {
                    if (user.queue_Num > position) {
                        user.queue_Num = user.queue_Num - 1;
                        UserService.updateUser(user, user.id);
                    }
                }
            )
        }
        this.updateQueue();
    }

    updateQueue = () => {
            let chatMessage = {
                userName: "default",
                content: "",
                action: "UPDATE_MY_QUEUE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    userJoin = () => {
        let chatMessage = {
            userName: "Harry2",
            content: "",
            action: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    onMessageReceived = (payload) => {
        console.log("ressss");
        this.sleep(50).then(r => {
            let payloadData = JSON.parse(payload.body);
            switch (payloadData.action) {
                case "UPDATE_MY_QUEUE":
                    console.log(payloadData.userName, "nice update");
                    UserService.getUsers().then((response) => {
                        this.setState({ users: response.data });
                    });
                    break;
            }
      	})
        
    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
}

export default UserComponent