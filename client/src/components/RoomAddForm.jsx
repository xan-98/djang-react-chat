import { useState } from "react";
import PropTypes from 'prop-types';



const RoomAddForm = ({addRoom}) => {
    const [roomName, setRoomName] = useState('');
    
    const handleSubmit = async e => {
		e.preventDefault();
        if (roomName.length < 1){
            return false
        }

        addRoom(roomName)
    

        setRoomName('')
        e.target.reset();
	}

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="input-group">
                    <input type="text" name='room' placeholder='Введите название чата' onChange={e => setRoomName(e.target.value)} required />
                    <button className='btn btn-add' type="submit">Создать</button>
                </div>
            </div>
        </form>
    )
}

RoomAddForm.propTypes = {
	addRoom: PropTypes.func.isRequired
};
export default RoomAddForm
