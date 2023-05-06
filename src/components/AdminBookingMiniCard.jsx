import moment from 'moment/moment';
import React from 'react';
import globalHotelId from '..';
import RoomsRequests from '../API/RoomsRequests';

const AdminBookingMiniCard = ({booking,setSelectedBooking,role}) => {

    function clickOnBooking (e){
        e.preventDefault();
        setSelectedBooking(booking.id)
    }
    function diffDates() {
        return (moment(booking.endDateTime, 'YYYY-MM-DD') - moment(booking.startDateTime, 'YYYY-MM-DD')) / (60 * 60 * 24 * 1000);
    };

    return (
        <div>
            <div>Бронирование номера {booking.roomName}</div>
            <div>С {moment(booking.startDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY')} по {moment(booking.endDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY')} ({diffDates()} дней)</div>
            <table style={{ padding:'5px'}}>
                <tr><td style={{textAlign:'left'}}>ФИО:</td><td style={{textAlign:'right'}}>{booking.fio}</td></tr>
                <tr><td style={{textAlign:'left'}}>Эл. почта:</td><td style={{textAlign:'right'}}>{booking.email}</td></tr>
                <tr><td style={{textAlign:'left'}}>Телефон:</td><td style={{textAlign:'right'}}>{booking.phone}</td></tr>
                <tr><td colspan="2" style={{textAlign:'center'}}>Ожидаемая общая цена</td></tr>
                <tr><td style={{textAlign:'left'}}>Стоимость номера</td><td style={{textAlign:'right'}}>{booking.price}р</td></tr>
                {
                    booking.servicesForBookings.map((service)=>
                        <tr>
                            <td style={{textAlign:'left'}}>{service.serviceName}</td>
                            <td style={{textAlign:'right'}}>{service.price==0? ('Бесплатно') : (service.price+'р')}</td>
                        </tr>
                    )
                }
                <tr><td style={{textAlign:'left'}}><b>Итого:</b></td><td style={{textAlign:'right'}}>{booking.price*diffDates()+booking.servicesForBookings.reduce((sum,current)=>sum+current.price,0)}р</td></tr>
            </table>

            
            {role=='admin'&&<button className='button_common' onClick={clickOnBooking}>Изменить</button>}
        </div>
    );
};

export default AdminBookingMiniCard;