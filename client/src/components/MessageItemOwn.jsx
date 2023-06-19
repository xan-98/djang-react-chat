import PropTypes from 'prop-types';
import readStatus from '../assets/image/read-status.svg';
import sendStatus from '../assets/image/send-status.svg';
import TopRight from '../assets/image/top-right-tip.svg';

const MessageItemOwn = ({ message,printDate }) => {
    const getTime = (timestamp)=>{
        var date = new Date(timestamp);
        var time = date.getHours() + ':' + date.getMinutes()
        return time
    }
    return (
        <>
            {printDate && <div className="date">{message.date}</div>}
            <div className="item-right">
                <div className="content">
                    <div className="message">{message.message}</div>
                    <div className="panel">
                        <div className="time">{getTime(message.timestamp)}</div>
                        <div className='status'>
                            {
                                message.status ?
                                    <img src={readStatus} alt="Read" />
                                    :
                                    <img src={sendStatus} alt="Read" />
                            }
                        </div>
                    </div>
                </div>
                <img className='corner' src={TopRight} alt=">" />
            </div>
        </>
    )
}

MessageItemOwn.propTypes = {
    message: PropTypes.object.isRequired,
    printDate: PropTypes.bool.isRequired,
};

export default MessageItemOwn
