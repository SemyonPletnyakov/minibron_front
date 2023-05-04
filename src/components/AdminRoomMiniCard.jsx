import React from 'react';
import { adminGlobalHotelId } from '..';
import RoomsRequests from '../API/RoomsRequests';

const AdminRoomMiniCard = ({room, setSelectedRoom, role}) => {
    function clickOnRoom (e){
        e.preventDefault();
        console.log(room.id)
        setSelectedRoom(room.id)
    }
    return (
        <div className='room_minicard'>
            <img className='img_room_minicard' src={RoomsRequests.getPictureLink(adminGlobalHotelId,room.id,room.pictureName)} alt="Картинка номера"/>
            <div>
                <div>{room.title}</div>
                <div className='room_minicard_low_block'>
                    <div>Цена: {room.price}р</div>
                    {role=='admin'&&<button className='button_common' onClick={clickOnRoom}>Изменить</button>}
                </div>
            </div>
        </div>
    );
};

export default AdminRoomMiniCard;