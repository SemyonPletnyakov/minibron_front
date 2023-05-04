import React, { useEffect, useState } from 'react';
import RoomsRequests from '../API/RoomsRequests';
import AdminRoomMiniCard from './AdminRoomMiniCard';
import { useCookies } from "react-cookie";
import AdminRoomFullCard from './AdminRoomFullCard';

const AdminRoomMenu = ({role}) => {
    const [roomData, setRoomData] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [selectedRoom, setSelectedRoom] = useState(0);
    const [isCreate, setIsCreate] = useState(false);
    

    useEffect(()=>{
        loadRoomsData();
    },[isCreate,selectedRoom])

    async function loadRoomsData(){
        await setRoomData(await RoomsRequests.getAllRooms(cookies?.token));
    }


    return (
        <div>
            {(selectedRoom==0&&!isCreate)?
                (<div>
                    <button onClick={e=>setIsCreate(true)}>Добавить</button>
                    {roomData.map(room=>
                        <AdminRoomMiniCard room={room} setSelectedRoom={setSelectedRoom} role={role}/>
                    )}
                </div>)
                :
                (<AdminRoomFullCard room={roomData.find(item=>item.id==selectedRoom)} isCreate={isCreate} setIsCreate={setIsCreate} setSelectedRoom={setSelectedRoom}/>)
            }
        </div>
    );
};

export default AdminRoomMenu;