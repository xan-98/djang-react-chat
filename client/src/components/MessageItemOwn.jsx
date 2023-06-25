import PropTypes from "prop-types";

import readStatus from "../assets/image/read-status.svg";
import sendStatus from "../assets/image/send-status.svg";
import TopRight from "../assets/image/top-right-tip.svg";

const MessageItemOwn = ({ message, printDate }) => {
  const getTime = (timestamp) => {
    var date = new Date(timestamp);
    var minute =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var time = date.getHours() + ":" + minute;
    return time;
  };
  return (
    <>
      {printDate && <div className="chat__date">{message.date}</div>}
      <div className="chat__item-right">
        <div className="chat__content">
          <div className="chat__message">{message.message}</div>
          <div className="chat__panel">
            <div className="chat__time">{getTime(message.timestamp)}</div>
            <div className="chat__status">
              {message.status ? (
                <img src={readStatus} alt="Read" />
              ) : (
                <img src={sendStatus} alt="Read" />
              )}
            </div>
          </div>
        </div>
        <img className="chat__corner" src={TopRight} alt=">" />
      </div>
    </>
  );
};

MessageItemOwn.propTypes = {
  message: PropTypes.object.isRequired,
  printDate: PropTypes.bool.isRequired,
};

export default MessageItemOwn;
