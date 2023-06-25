import PropTypes from "prop-types";
import { useState } from "react";

const RoomAddForm = ({ addRoom }) => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roomName.length < 1) {
      return false;
    }

    addRoom(roomName);

    setRoomName("");
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="center-form__group">
        <div className="center-form__input-group">
          <input
            type="text"
            name="room"
            placeholder="Введите название чата"
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
          <button className="btn" type="submit">
            Создать
          </button>
        </div>
      </div>
    </form>
  );
};

RoomAddForm.propTypes = {
  addRoom: PropTypes.func.isRequired,
};
export default RoomAddForm;
