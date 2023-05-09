import moment from 'moment/moment';
import React, { useState } from 'react';
import globalHotelId from '..';
import BookingsRequests from '../API/BookingsRequests';

const BookingForUser = ({selectedRoom, selectedService, startDate, endDate, goToServices, goToFirstComponent}) => {
    const [fio, setFio] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bookingState, setBookingState] = useState(0);

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
        if(bookingState==0 || bookingState == -1)
        {
            const bookingId = await BookingsRequests.newBooking(startDate,endDate,fio,phone,email,selectedRoom.id,globalHotelId);
            if(bookingId>0){
                selectedService.forEach((service)=>
                    BookingsRequests.newBookingService(service.id,bookingId,1)
                );
                setBookingState(1);
            }
            else setBookingState(-1);
        }
        else setBookingState(2);
        
    }
    const goFistButtonInClicked = (e) => {
        e.preventDefault();
        goToFirstComponent();
    }


    return (
        <div className='booking_for_users'>
            <div className="button_back_left">
                <button className='button_common' onClick={clickOnBackButton}>Назад</button>
            </div>
            <div className='booking_for_users_body'>
                <div className='booking_for_users_left'>
                    <div className='text_center_and_padding'><b>Контактные данные</b></div>
                    <div className='margin_bottom'>
                        <div>ФИО</div>
                        <input className="text-field__input" onChange={fioInputChange}></input>
                    </div>
                    <div className='margin_bottom'>
                        <div>E-mail</div>
                        <input className="text-field__input" onChange={emailInputChange}></input>
                    </div>
                    <div className='margin_bottom'>
                        <div>Мобильный телефон</div>
                        <input className="text-field__input" onChange={phoneInputChange}></input>
                    </div>
                    <div className='center_column'>
                        <div className='margin_bottom'>
                            <button className='button_add' onClick={booking}>Забронировать</button>
                        </div>
                        <button className='button_common' onClick={goFistButtonInClicked}>На главную</button>
                        {bookingState==1&&
                            <div className='success_massege'>Успешное бронирование номера</div>
                        }
                        {bookingState==2&&
                            <div className='info_massege'>Вы уже забронировали номер</div>
                        }
                        {bookingState==-1&&
                            <div className='error_massege'>Что-то пошло не так</div>
                        }
                    </div>
                </div>
                <div>
                    <div>Бронирование номера {selectedRoom.title}</div>
                    <div>Вместимость/число коек = {selectedRoom.capacity}</div>
                    <div>С {moment(startDate, 'YYYY-MM-DD').format('DD.MM.YYYY')} по {moment(endDate, 'YYYY-MM-DD').format('DD.MM.YYYY')} ({diffDates()} дней)</div>

                    <table style={{ padding:'5px'}}>
                        <tr><td colspan="2" style={{textAlign:'center'}}>Общая цена</td></tr>
                        <tr><td style={{textAlign:'left'}}>Стоимость номера в день</td><td style={{textAlign:'right'}}>{selectedRoom.price}р</td></tr>
                        {
                            selectedService.map((service)=>
                                <tr>
                                    <td style={{textAlign:'left'}}>{service.title}</td>
                                    <td style={{textAlign:'right'}}>{service.price==0? ('Бесплатно') : (service.price+'р')}</td>
                                </tr>
                            )
                        }
                        <tr><td style={{textAlign:'left'}}><b>Итого:</b></td><td style={{textAlign:'right'}}>{selectedRoom.price*diffDates()+selectedService.reduce((sum,current)=>sum+current.price,0)}р</td></tr>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingForUser;