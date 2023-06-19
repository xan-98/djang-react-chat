import { Link } from "react-router-dom"
import PropTypes from 'prop-types';
import ArrowRight from '../assets/image/arrow-right.svg';

const RoomItem = ({room}) => {
    return (
        <Link to={'room/'+room.id} className="item">
            <div className="name">{room.name}</div>
            <img src={ArrowRight} alt="Right" />
        </Link>
    )
}

RoomItem.propTypes = {
	room: PropTypes.object.isRequired
};

export default RoomItem
