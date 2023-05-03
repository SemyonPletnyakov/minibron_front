import React from 'react';
import RoomMiniCard from './RoomMiniCard';

const RoomsMenu = ({roomsData, selectRoom}) => {
    return (
        <div style={{justifyContent: 'flex-start'}}>
            {roomsData.map((room)=>
                            <RoomMiniCard room = {room} selectRoom = {selectRoom}/>
                        )
            }
        </div>
    );
};

export default RoomsMenu;