import PropTypes from "prop-types";
import ApiConnector from "./api/apiConnector";

import ExitIcon from "./assets/image/exit.svg";
import "./assets/style/room.scss";

import { ToastContainer, toast } from "react-toastify";
import RoomAddForm from "./components/RoomAddForm";
import RoomItem from "./components/RoomItem";

const Room = ({ roomList }) => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const addRoom = async (name) => {
    const data = await ApiConnector.sendPostRequest("chat/rooms/", {
      name: name,
    });
    if (data?.status != "success") {
      toast.error("Нежелательная ошибка", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    if (data?.new) {
      toast.success(`${name} - создать чат успешно`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.info(`${name} - уже существует!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <div className="room">
      <div className="room__navbar" onClick={logout}>
        <img className="exit" src={ExitIcon} alt="Exit" />
      </div>
      <div className="page">
        <div className="center-form">
          <div className="center-form__header">Выберите / создайте чат</div>
          <div className="room__list">
            {roomList.toReversed().map((room, index) => (
              <RoomItem room={room} key={index} />
            ))}
          </div>
          <RoomAddForm addRoom={addRoom} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

Room.propTypes = {
  roomList: PropTypes.array.isRequired,
};
export default Room;
