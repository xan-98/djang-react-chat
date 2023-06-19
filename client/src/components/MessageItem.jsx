import TopLeft from '../assets/image/top-left-tip.svg';
import PropTypes from 'prop-types';
const MessageItem = ({ message, printDate = false }) => {
    const getTime = (timestamp)=>{
        var date = new Date(timestamp);
        var time = date.getHours() + ':' + date.getMinutes()
        return time
    }
    return (
        <>
            {printDate && <div className="date">{message.date}</div>}
            <div className="item">
                <img className='corner' src={TopLeft} alt="<" />
                <div className="content">
                    <div className="username">{message.username}</div>
                    <div className="message">
                        {message.message}
                    </div>
                    <div className="panel">
                        <div className="time">{getTime(message.timestamp)}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    printDate: PropTypes.bool.isRequired,
};

export default MessageItem
