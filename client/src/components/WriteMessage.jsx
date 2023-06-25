import PropTypes from "prop-types";
import { useState } from "react";
import PaperAirplane from "../assets/image/paper-airplane.svg";

const WriteMessage = ({ onWrite }) => {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (messageText.length < 1) {
      return false;
    }

    onWrite(messageText);

    setMessageText("");
    e.target.reset();
  };
  return (
    <div className="chat__write">
      <form onSubmit={handleSubmit}>
        <div className="chat__input-group">
          <input
            type="text"
            name="message"
            placeholder="Сообщение..."
            autoComplete="off"
            onChange={(e) => setMessageText(e.target.value)}
          />

          <button type="submit">
            <img className="chat__send-icon" src={PaperAirplane} alt="Send" />
          </button>
        </div>
      </form>
    </div>
  );
};

WriteMessage.propTypes = {
  onWrite: PropTypes.func.isRequired,
};
export default WriteMessage;
