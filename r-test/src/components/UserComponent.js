import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth'
import { Dropdown } from 'react-bootstrap'

var stompClient = null;

export const Users = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        connected: false
    });

    useEffect(() => {
        connect();
    }, []);

    const connect = () => {
        UserService.getUsers().then((response) => {
            setUsers(response.data);
            if (!stompClient) {
                console.log("stomp here")
                let Sock = new SockJS('https://arcane-sierra-36888.herokuapp.com/ws');
                stompClient = over(Sock);
                stompClient.connect({}, onConnected, onError);
            }
        });
    }

    const onConnected = () => {
        console.log("update keke")
        setUserData({ "username": JSON.parse(sessionStorage.getItem('user')), "connected": true });
        stompClient.subscribe('/chatroom', onMessageReceived);
        updateQueue();
    }

    const onError = (err) => {
        console.log(err);
    }

    const crDelUserTest = () => {
        setUserData({ "username": JSON.parse(sessionStorage.getItem('user')), "connected": true });
        var login = userData.username
        var max = 0;
        var position = 0;
        users.map(
            user => {
                if (user.name === login) {
                    position = user.queue_Num;
                }
                if (max < user.queue_Num) max = user.queue_Num
            }
        )
        if (position === 0) {
            let fount = document.getElementById('QueueFunc');
            fount.innerHTML = "Leave Queue";
            users.map(
                user => {
                    if (user.name === login) {
                        user.queue_Num = max + 1
                        UserService.updateUser(user, user.id);
                    }
                }
            )
        }
        else {
            let fount = document.getElementById('QueueFunc');
            fount.innerHTML = "Join Queue";
            users.map(
                user => {
                    if (user.name === login) {
                        user.queue_Num = 0
                        UserService.updateUser(user, user.id);
                    }
                    if (user.queue_Num > position) {
                        user.queue_Num = user.queue_Num - 1;
                        UserService.updateUser(user, user.id);
                    }
                }
            )
        }
        updateQueue();
    }

    const logOut = () => {
        var login = userData.username
        var needId = 12345;
        var position = 0;
        users.map(
            user => {
                if (user.name === login) {
                    needId = user.id;
                    position = user.queue_Num;
                }
            }
        )

        if (!(position === 0)) {
            users.map(
                user => {
                    if (user.name === login) {
                        user.queue_Num = 0
                        UserService.updateUser(user, user.id);
                    }
                    if (user.queue_Num > position) {
                        user.queue_Num = user.queue_Num - 1;
                        UserService.updateUser(user, user.id);
                    }
                }
            )
        }
        UserService.deleteUser(needId);
        updateQueue();
        sessionStorage.removeItem('user');
        navigate('/login')
    }

    const updateQueue = () => {
        setUserData({ "username": JSON.parse(sessionStorage.getItem('user')), "connected": true });
        let chatMessage = {
            userName: userData.username,
            content: "",
            action: "UPDATE_MY_QUEUE"
        };
        console.log(chatMessage);
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        sleep(100);
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.action) {
            case "UPDATE_MY_QUEUE":
                console.log(payloadData.userName, "nice update");
                UserService.getUsers().then((response) => {
                    setUsers(response.data);
                });
                break;
        }
    }

    const sleep = (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    return (
        <div>
            <header>
                <nav className="navbar navbar-light bg-light headernavbar">
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-actions">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item id="QueueFunc" onClick={crDelUserTest}>Join Queue</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-student">
                            {userData.username}
                        </Dropdown.Toggle>

                        <Dropdown.Menu align={{ lg: 'end' }}>
                            <Dropdown.Item onClick={logOut}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </nav>
            </header>
            <main className="main_new">
                <h1 className="text-center">Queue Express</h1>
                <table className="table_new" id="usersTable">
                    <thead>
                        <tr>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users
                                .filter(user => user.queue_Num !== 0)
                                .sort(({ queue_Num: previous }, { queue_Num: current }) => previous - current)
                                .map(
                                    user =>
                                        <tr className="table_row" key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.queue_Num}</td>
                                        </tr>
                                )
                        }
                    </tbody>
                </table>
            </main>
        </div>
    )
    
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
        style={{ cursor: "pointer" }}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </span>
));


// if (!(user.queue_Num === 0)) {
//     let fount = document.getElementById('my body');
//     let tr = document.createElement('tr');
//     let td1 = document.createElement('td');
//     let td2 = document.createElement('td');
//     td1.innerHTML = user.name;
//     td2.innerHTML = user.queue_Num;
//     tr.appendChild(td1);
//     tr.appendChild(td2);
//     fount.appendChild(tr);
// }

