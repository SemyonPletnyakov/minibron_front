import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import BookingsRequests from '../API/BookingsRequests';
import AdminBookingFullCard from './AdminBookingFullCard';
import AdminBookingMiniCard from './AdminBookingMiniCard';

const AdminBookingMenu = ({role}) => {
    const [bookingData, setBookingData] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [selectedBooking, setSelectedBooking] = useState(0);
    const [isCreate, setIsCreate] = useState(false);

    useEffect(()=>{
        loadRoomsData();
    },[isCreate,selectedBooking])

    async function loadRoomsData(){
        await setBookingData(await BookingsRequests.getActual(cookies?.token));
    }

    return (
        <div>
            {(selectedBooking==0&&!isCreate)?
                (<div className='admin_room_menu'>
                    <button className='button_add' onClick={e=>setIsCreate(true)}>Добавить</button>
                    {bookingData.map(booking=>
                        <AdminBookingMiniCard booking={booking} setSelectedBooking={setSelectedBooking} role={role}/>
                    )}
                </div>)
                :
                (<AdminBookingFullCard booking={bookingData.find(item=>item.id==selectedBooking)} isCreate={isCreate} setIsCreate={setIsCreate} setSelectedBooking={setSelectedBooking}/>)
            }
        </div>
    );
};

export default AdminBookingMenu;