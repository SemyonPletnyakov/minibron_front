import React, { useEffect, useState } from 'react';
import RoomsRequests from '../API/RoomsRequests';
import AdminRoomMiniCard from './AdminRoomMiniCard';
import { useCookies } from "react-cookie";
import AdminRoomFullCard from './AdminRoomFullCard';

const AdminRoomMenu = () => {
    const [roomData, setRoomData] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [selectedRoom, setSelectedRoom] = useState(0);
    

    useEffect(()=>{
        loadRoomsData();
    },[])

    async function loadRoomsData(){
        await setRoomData(await RoomsRequests.getAllRooms(cookies?.token));
    }


    return (
        <div>
            {(selectedRoom==0)?
                (<div>
                    {roomData.map(room=>
                        <AdminRoomMiniCard room={room} setSelectedRoom={setSelectedRoom}/>
                    )}
                </div>)
                :
                (<AdminRoomFullCard room={roomData[selectedRoom-1]}/>)
            }
        </div>
    );
};

export default AdminRoomMenu;