import React from 'react';
import moment from 'moment/moment';

const SessionMiniCard = ({session,setSelectedSession,role}) => {

    function clickOnSession (e){
        e.preventDefault();
        setSelectedSession(session.id)
    }
    function diffDates() {
        let endDate = (session.endDateTime!=null ? moment(session.endDateTime, 'YYYY-MM-DD'):new Date());
        if(endDate>moment(session.startDateTime, 'YYYY-MM-DD'))
            return (endDate - moment(session.startDateTime, 'YYYY-MM-DD')) / (60 * 60 * 24 * 1000);
        else return 0;
    };


    return (
        <div className='admin_booking_card'>
            <div className="booking_for_users_left">
                <div>Заселённый номер {session.roomName}</div>
                <div>С {moment(session.startDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY')} по {session.endDateTime!=null ? moment(session.endDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY'):'(дата отъезда не определена)'} ({diffDates()} дней)</div>
                <table style={{ padding:'5px'}}>
                    <tr><td style={{textAlign:'left'}}>ФИО:</td><td style={{textAlign:'right'}}>{session.fio}</td></tr>
                    <tr><td style={{textAlign:'left'}}>Эл. почта:</td><td style={{textAlign:'right'}}>{session.email}</td></tr>
                    <tr><td style={{textAlign:'left'}}>Телефон:</td><td style={{textAlign:'right'}}>{session.phone}</td></tr>
                </table>
                {role=='admin'&&<button className='button_common' onClick={clickOnSession}>Изменить</button>}
            </div>
            <table>
                <tr><td colspan="2" style={{textAlign:'center'}}>Общая договорная цена</td></tr>
                <tr><td style={{textAlign:'left'}}>Стоимость номера</td><td style={{textAlign:'right'}}>{session.actualPriceForRoom}р</td></tr>
                {
                    session.servicesForSessions.map((service)=>
                        <tr>
                            <td style={{textAlign:'left'}}>{service.serviceName}</td>
                            <td style={{textAlign:'right'}}>{service.actualPrice==0? ('Бесплатно') : (service.actualPrice+'р')}</td>
                        </tr>
                    )
                }
                <tr><td style={{textAlign:'left'}}><b>Итого:</b></td><td style={{textAlign:'right'}}>{session.totalPrice}р</td></tr>
            </table>
        </div>
    );
};

export default SessionMiniCard;