import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ArrowRight from "../assets/image/arrow-right.svg";

const RoomItem = ({ room }) => {
  return (
    <Link to={"room/" + room.id} className="room__item">
      <div className="room__name">{room.name}</div>
      <img src={ArrowRight} alt="Right" />
    </Link>
  );
};

RoomItem.propTypes = {
  room: PropTypes.object.isRequired,
};

export default RoomItem;
