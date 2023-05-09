import React from 'react';
import { adminGlobalHotelId } from '..';
import RoomsRequests from '../API/RoomsRequests';

const AdminRoomMiniCard = ({room, setSelectedRoom, role}) => {
    function clickOnRoom (e){
        e.preventDefault();
        setSelectedRoom(room.id)
    }
    return (
        <div className='admin_room_card'>
            <img className='service_img' src={RoomsRequests.getPictureLink(adminGlobalHotelId,room.id,room.pictureName)} alt="Картинка номера"/>
            <div className='service_main'>
                <div className='margin_bottom'>{room.title}</div>
                <div className='margin_bottom'>{room.description}</div>
                <div className='margin_bottom'>Вместимость: {room.capacity}</div>
                <div className='margin_bottom'>Цена: {room.price}р</div>
                {role=='admin'&&<button className='button_common' onClick={clickOnRoom}>Изменить</button>}
                
            </div>
        </div>
    );
};

export default AdminRoomMiniCard;