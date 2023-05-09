import React from 'react';
import RoomMiniCard from './RoomMiniCard';

const RoomsMenu = ({roomsData, selectRoom}) => {
    return (
        <div className='room_menu'>
            {roomsData.map((room)=>
                            <RoomMiniCard room = {room} selectRoom = {selectRoom}/>
                        )
            }
        </div>
    );
};

export default RoomsMenu;