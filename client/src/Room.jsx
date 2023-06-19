import './assets/style/room.scss';
import ExitIcon from './assets/image/exit.svg';
import RoomItem from "./components/RoomItem";
import PropTypes from 'prop-types';
import RoomAddForm from "./components/RoomAddForm";


const Room = ({ addRoom, roomList }) => {
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
    return (
        <div className="room">
            <div className="navbar" onClick={logout}>
                <img className="exit" src={ExitIcon} alt="Exit" />
            </div>
            <div className="page">
                <div className='form-wrapper'>
                    <div className="header">
                        Выберите / создайте чат
                    </div>
                    <div className="list">
                        {
                            roomList.toReversed().map((room, index) => (
                                <RoomItem room={room} key={index} />
                            ))
                        }
                    </div>
                    <RoomAddForm addRoom={addRoom} />
                </div>
            </div>
        </div>
    )
}

Room.propTypes = {
    addRoom: PropTypes.func.isRequired,
    roomList: PropTypes.array.isRequired
};
export default Room
