import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./Chat";
import Page404 from "./Page404";
import Room from "./Room";
import ServerUrl from "./api/serverUrl";
import CommonUtil from "./util/commonUtil";

var socket = null;

const Router = () => {
  const [roomList, setRoomList] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [readMessage, setReadMessage] = useState("");
  const user = CommonUtil.getUser();

  const token = CommonUtil.getToken();
  if (socket == null) {
    socket = new WebSocket(
      ServerUrl.WS_BASE_URL + `ws/users/chat/?token=${token}`
    );
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.action == "list_room") {
      setRoomList(data.list);
    }

    if (data.action == "message") {
      setReadMessage("");
      setNewMessages([data, ...newMessages]);
    }

    if (data.action == "read") {
      setReadMessage(data.room);
    }
  };

  const joinRoom = (id) => {
    if (socket.readyState == WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: "join_room",
          room_id: id,
        })
      );
    } else {
      try {
        setTimeout(() => {
          socket.send(
            JSON.stringify({
              action: "join_room",
              room_id: id,
            })
          );
        }, 400);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const exitRoom = (id) => {
    socket.send(
      JSON.stringify({
        action: "exit_room",
        room_id: id,
      })
    );
  };

  const getRoom = (id) => {
    return roomList.find((x) => x.id == id);
  };

  const sendRead = (roomid) => {
    if (socket.readyState == WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: "read",
          room: roomid,
        })
      );
    } else {
      try {
        setTimeout(() => {
          socket.send(
            JSON.stringify({
              action: "read",
              room: roomid,
            })
          );
        }, 400);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Room roomList={roomList} />} />
        <Route
          path="/room/:id"
          element={
            <Chat
              user={user}
              joinRoom={joinRoom}
              exitRoom={exitRoom}
              getRoom={getRoom}
              newMessages={newMessages}
              readMessage={readMessage}
              sendRead={sendRead}
            />
          }
        />
        <Route path="*" element={<Page404/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
