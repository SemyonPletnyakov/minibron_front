import React from 'react';
import globalHotelId from '..';
import RoomsRequests from '../API/RoomsRequests';
import '../styles/main.css';

const RoomMiniCard = ({room, selectRoom}) => {
    function clickOnRoom(e){
        e.preventDefault();
        selectRoom(room.id);
    }
    return (
        <div className='room_minicard'>
            <img className='img_room_minicard' src={RoomsRequests.getPictureLink(globalHotelId,room.id,room.pictureName)} alt="Картинка номера" onClick={clickOnRoom}/>
            <div>
                <div onClick={clickOnRoom}>{room.title}</div>
                <div className='room_minicard_low_block'>
                    <div>Цена: {room.price}р</div>
                    <button className='button_common' onClick={clickOnRoom}>Подробнее</button>
                </div>
            </div>
        </div>
    );
};

export default RoomMiniCard;