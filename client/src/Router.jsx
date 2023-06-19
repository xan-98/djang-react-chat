import { BrowserRouter, Routes, Route } from "react-router-dom";
import Room from "./Room";
import Chat from "./Chat";
import CommonUtil from "./util/commonUtil";
import { useState } from "react";
import ServerUrl from "./api/serverUrl";

var socket = null

const Router = () => {
    const [roomList, setRoomList] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    const [readMessage, setReadMessage] = useState('');

    const user = CommonUtil.getUser()
    if (socket == null) {
        socket = new WebSocket(
            ServerUrl.WS_BASE_URL + `ws/users/${user.id}/chat/`
        );
    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.action == 'list_room') {
            setRoomList(data.list)
        }

        if (data.action == 'message') {
            setReadMessage('')
            setNewMessages([data,...newMessages])
        }
        
        if (data.action == 'read') {
            setReadMessage(data.room)
        }
    }

    const addRoom = (name) => {
        socket.send(
            JSON.stringify({
                action: 'new_room',
                room_name: name
            })
        );
    }

    const joinRoom = (id) => {
        if (socket.readyState == WebSocket.OPEN){
            socket.send(
                JSON.stringify({
                    action: 'join_room',
                    room_id: id
                })
            );
        }else{
            try {
                setTimeout(()=>{
                    socket.send(
                        JSON.stringify({
                            action: 'join_room',
                            room_id: id
                        })
                    );
                },400)
            } catch (error) {
                console.log(error);
            }
        }
    }

    const exitRoom = (id) => {
        socket.send(
            JSON.stringify({
                action: 'exit_room',
                room_id: id
            })
        );
    }

    const getRoom = (id) => {
        return roomList.find(x => x.id == id)
    }

    const sendMessage = (roomid,userId,message) => {
        socket.send(
            JSON.stringify({
                action: 'message',
                room: roomid,
                user: userId,
                message:message
            })
        );
    }

    const sendRead = (roomid,userId) => {
        if (socket.readyState == WebSocket.OPEN){
            socket.send(
                JSON.stringify({
                    action: 'read',
                    room: roomid,
                    user: userId,
                })
            );
        }else{
            try {
                setTimeout(()=>{
                    socket.send(
                        JSON.stringify({
                            action: 'read',
                            room: roomid,
                            user: userId,
                        })
                    );
                },400)
            } catch (error) {
                console.log(error);
            }
        }
        
    }

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Room addRoom={addRoom} roomList={roomList} />} />
                <Route path="/room/:id" 
                    element={<Chat 
                    user={user}
                    joinRoom={joinRoom}
                    exitRoom={exitRoom}
                    getRoom={getRoom}
                    sendMessage={sendMessage} 
                    newMessages={newMessages} 
                    readMessage={readMessage} 
                    sendRead={sendRead}
                    />} />
            </Routes>
        </BrowserRouter>
    )
}



export default Router