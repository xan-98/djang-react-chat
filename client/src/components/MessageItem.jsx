import PropTypes from "prop-types";
import TopLeft from "../assets/image/top-left-tip.svg";
const MessageItem = ({ message, printDate = false }) => {
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
      <div className="chat__item">
        <img className="chat__corner" src={TopLeft} alt="<" />
        <div className="chat__content">
          <div className="chat__username">{message.username}</div>
          <div className="chat__message">{message.message}</div>
          <div className="chat__panel">
            <div className="chat__time">{getTime(message.timestamp)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  printDate: PropTypes.bool.isRequired,
};

export default MessageItem;
