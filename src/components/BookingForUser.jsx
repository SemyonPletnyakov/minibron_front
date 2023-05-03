import moment from 'moment/moment';
import React, { useState } from 'react';
import globalHotelId from '..';
import BookingsRequests from '../API/BookingsRequests';

const BookingForUser = ({selectedRoom, selectedService, startDate, endDate, goToServices, goToFirstComponent}) => {
    const [fio, setFio] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    

    function diffDates() {
        return (moment(endDate, 'YYYY-MM-DD') - moment(startDate, 'YYYY-MM-DD')) / (60 * 60 * 24 * 1000);
    };

    const clickOnBackButton = (e) =>{
        e.preventDefault();
        goToServices();
    };
    

    const fioInputChange = (e) =>{
        setFio(e.target.value);
    }
    const emailInputChange = (e) =>{
        setEmail(e.target.value);
    }
    const phoneInputChange = (e) =>{
        setPhone(e.target.value);
    }
    async function booking (e) {
        e.preventDefault();
        const bookingId = await BookingsRequests.newBooking(startDate,endDate,fio,phone,email,selectedRoom.id,globalHotelId);
        selectedService.forEach((service)=>
            BookingsRequests.newBookingService(service.id,bookingId,1)
        );
    }
    const goFistButtonInClicked = (e) => {
        e.preventDefault();
        goToFirstComponent();
    }


    return (
        <div>
            <button onClick={clickOnBackButton}>Назад</button>
            <div>Бронирование номера {selectedRoom.title}</div>
            <div>Вместимость/число коек = {selectedRoom.capacity}</div>
            <div>С {moment(startDate, 'YYYY-MM-DD').format('DD.MM.YYYY')} по {moment(endDate, 'YYYY-MM-DD').format('DD.MM.YYYY')} ({diffDates()} дней)</div>

            <table style={{ padding:'5px'}}>
                <tr><td colspan="2" style={{textAlign:'center'}}>Общая цена</td></tr>
                <tr><td style={{textAlign:'left'}}>Стоимость номера</td><td style={{textAlign:'right'}}>{selectedRoom.price}р</td></tr>
                {
                    selectedService.map((service)=>
                        <tr>
                            <td style={{textAlign:'left'}}>{service.title}</td>
                            <td style={{textAlign:'right'}}>{service.price==0? ('Бесплатно') : (service.price+'р')}</td>
                        </tr>
                    )
                }
                <tr><td style={{textAlign:'left'}}><b>Итого:</b></td><td style={{textAlign:'right'}}>{selectedRoom.price+selectedService.reduce((sum,current)=>sum+current.price,0)}р</td></tr>
            </table>
            <div>ФИО</div>
            <input onChange={fioInputChange}></input>
            <div>E-mail</div>
            <input onChange={emailInputChange}></input>
            <div>Мобильный телефон</div>
            <input onChange={phoneInputChange}></input>
            <button onClick={booking}>Забронировать</button>
            <button onClick={goFistButtonInClicked}>На главную</button>
        </div>
    );
};

export default BookingForUser;