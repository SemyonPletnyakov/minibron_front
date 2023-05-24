import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import globalHotelId from '..';
import RoomsRequests from '../API/RoomsRequests';
import ServicesRequests from '../API/ServicesRequests';
import 'react-day-picker/dist/style.css';
import moment from 'moment/moment';
import { format, isAfter, isBefore, isValid, parse } from 'date-fns';
import { DayPicker, SelectRangeEventHandler} from 'react-day-picker';
import { ru } from 'date-fns/locale'
import BookingsRequests from '../API/BookingsRequests';

const AdminBookingFullCard = ({booking,isCreate,setIsCreate,setSelectedBooking, jwt}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const [bookingId, setBookingId] = useState(!isCreate&& booking!=null? booking.id : 0);
    const[roomId, setRoomId] = useState(!isCreate&& booking!=null? booking.roomId : 0);
    const[startDateTime, setStartDateTime] = useState(!isCreate&& booking!=null? moment(booking.startDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY') : "");
    const[endDateTime, setEndDateTime] = useState(!isCreate&& booking!=null? moment(booking.endDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY') : "");
    const [selectedRange, setSelectedRange] = useState(!isCreate&& booking!=null? {from: parse(moment(booking.startDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY'), 'dd.MM.y', new Date()), to:parse(moment(booking.endDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY'), 'dd.MM.y', new Date())} : {});
    
    const [fio, setFio] = useState(!isCreate&& booking!=null? booking.fio : "");
    const [email, setEmail] = useState(!isCreate&& booking!=null? booking.phone : "");
    const [phone, setPhone] = useState(!isCreate&& booking!=null? booking.email : "");
    const [services, setServices] = useState(!isCreate&& booking!=null? booking.servicesForBookings.map(x=>x.id) : []);
    const [selectedRoom, setSelectedRoom] = useState(false);
    const [changedRoom, setChenagedRoom] = useState(false);
    const [mainRoom, setMainRoom] = useState({id:0})
    const [serviceUpdate, setServiceUpdate] = useState(false);

    const [roomData, setRoomData] = useState([]);
    const [servicesData, setServicesData] = useState([]);

    const[dateError, setDateError] = useState(false);

    useEffect(()=>{
        loadData();
    },[])

    async function loadData(){
        const serviceResult = await ServicesRequests.getAll(globalHotelId);
        setServicesData(serviceResult.map(x=>(
            {
                id:x.id, 
                oldId: booking?.servicesForBookings.find(y=>y.additionalServiceId==x.id)?.id ?? 0,
                title: x.title, 
                price: x.price, 
                action: booking?.servicesForBookings.find(y=>y.additionalServiceId==x.id)!=null
            })));
        
        const roomResult = await RoomsRequests.getAllRooms(jwt);
        setRoomData(roomResult);
        if(typeof roomResult.filter(x=>x.id==roomId) != "undefined")
            setMainRoom(roomResult.find(x=>x.id==roomId) ?? mainRoom);
    }

    async function submitOnClick(e){
        
        let response;
        if(!isCreate){
            response = await BookingsRequests.updateBooking({
                id:bookingId,
                roomId: roomId,
                startDateTime: moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                endDateTime: moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                fio: fio,
                phone: phone,
                email: email
            },jwt);
            if(response){
                for (let i = 0; i < servicesData.length; i++) {
                    if(servicesData[i].oldId>0 && !servicesData[i].action)
                        BookingsRequests.deleteBookingServiceById({id:servicesData[i].oldId}, jwt);
                    if(servicesData[i].oldId==0 && servicesData[i].action)
                        await BookingsRequests.newBookingService(servicesData[i].id, bookingId, globalHotelId);
                }
               
            }
        }
        else{
            let dateCheck = await RoomsRequests.getActual(
                                moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                mainRoom.capacity,globalHotelId);
            if(!dateCheck.find(x=>x.id==roomId) || (typeof dateCheck.find(x=>x.id==roomId) == "undefined")){
                setDateError(true);
            }
            else{
                response = await BookingsRequests.newBooking(
                                    moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                    moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                    fio, phone, email, roomId, globalHotelId);
                if(response>0){
                    for (let i = 0; i < servicesData.length; i++) {
                        if(servicesData[i].oldId==0 && servicesData[i].action)
                            await BookingsRequests.newBookingService(servicesData[i].id, response, globalHotelId);
                    }
                    setDateError(false);
                    setBookingId(response);
                    setIsCreate(false);
                    setSelectedBooking(response);
                }
            }
        }
         
    }
    async function onClickDeleteButton(e){
        await BookingsRequests.deleteBookingById({id:bookingId}, jwt);
        setIsCreate(false);
        setSelectedBooking(0);
    }
    //-----------время----------

    const handleStartChange = (e) =>{
        setStartDateTime(e.target.value);
        const date = parse(e.target.value, 'dd.MM.y', new Date());
        if (!isValid(date)) {
          return setSelectedRange({ from: undefined, to: undefined });
        }
        if (selectedRange?.to && isAfter(date, selectedRange.to)) {
          setSelectedRange({ from: selectedRange.to, to: date });
        } else {
          setSelectedRange({ from: date, to: selectedRange?.to });
        }
      };
      const handleEndChange = (e) => {
        setEndDateTime(e.target.value);
        const date = parse(e.target.value, 'dd.MM.y', new Date());
    
        if (!isValid(date)) {
          return setSelectedRange({ from: selectedRange?.from, to: undefined });
        }
        if (selectedRange?.from && isBefore(date, selectedRange.from)) {
          setSelectedRange({ from: date, to: selectedRange.from });
        } else {
          setSelectedRange({ from: selectedRange?.from, to: date });
        }
      };
      const handleRangeSelect = ( range ) => {
        setSelectedRange(range);
        if (range?.from) {
            setStartDateTime(format(range.from, 'dd.MM.y'));
        } else {
            setStartDateTime('');
        }
        if (range?.to) {
            setEndDateTime(format(range.to, 'dd.MM.y'));
        } else {
            setEndDateTime('');
        }
      };
    //-----------конец-----------

    return (
        <div className='admin_room_menu'>
            <div className='margin_bottom'>
                {(!changedRoom && mainRoom.id!=0) &&
                        <div className='center_column'>
                            <span className='margin_bottom'>Текущий номер: {mainRoom.title}</span>
                            <span className='margin_bottom'> Вместимость: {mainRoom.capacity}</span>
                            <span className='margin_bottom'>Цена в день: {mainRoom.price}р</span>
                            <button className="button_common" onClick={e=>setChenagedRoom(true)}>Сменить номер</button> 
                        </div>}
                {(mainRoom.id==0 && !changedRoom)&&
                    <button className="button_add" onClick={e=>setChenagedRoom(true)}>Выбрать номер</button>
                }
                {(changedRoom)&&
                    <div>
                        <button className="button_common" onClick={e=>setChenagedRoom(false)}>Скрыть номера</button> 
                        <table>
                            {roomData.map(room=>
                                <tr>
                                    <td style={{textAlign:'left'}}>{room.title}</td>
                                    <td style={{textAlign:'left'}}>  Вместимость: {room.capacity}</td>
                                    <td style={{textAlign:'left'}}>  Цена в день: {room.price}р  </td>
                                    <td style={{textAlign:'left'}}>{(room.id != roomId)?
                                        <button className="button_common" onClick={e=>
                                            {
                                                setRoomId(room.id); 
                                                setMainRoom(room);
                                            }}>Переместить в</button>
                                        :<div className='button_add'>Выбрано</div>}</td>
                                </tr>
                            )}
                        </table>
                    </div>
                }
            </div>
            <div className='center_column'>
                <div className='margin_bottom'>
                        <span> Дата начала:</span>
                        <input
                            placeholder="Заезд"
                            value={startDateTime}
                            onChange={handleStartChange}
                            className="text-field__input"
                        />
                </div>
                <div>   
                    <span>Дата конца:</span>
                    <input
                        placeholder="Выезд"
                        value={endDateTime}
                        onChange={handleEndChange}
                        className="text-field__input"
                    />
                </div>
                <DayPicker locale={ru}
                    mode="range"
                    selected={selectedRange}
                    onSelect={handleRangeSelect}                        
                />
            </div>
            <div className='margin_bottom'><b>Данные клиента</b></div>
            <div className='margin_bottom'>
                <div>ФИО</div>
                <input className="text-field__input" onChange={e=>setFio(e.target.value)} value={fio}></input>
            </div>
            <div className='margin_bottom'>
                <div>E-mail</div>
                <input className="text-field__input" onChange={e=>setEmail(e.target.value)} value={email}></input>
            </div>
            <div className='margin_bottom'>
                <div>Мобильный телефон</div>
                <input className="text-field__input" onChange={e=>setPhone(e.target.value)} value={phone}></input>
            </div>
            <div className='margin_bottom'><b>Дополнительные услуги</b></div>
            <div className='margin_bottom'>
                {(serviceUpdate || !serviceUpdate)&&
                <table>
                    {servicesData.map(service=>
                        <tr>
                            <td style={{textAlign:'left'}}>{service.title}</td>
                            <td style={{textAlign:'left'}}>  Цена: {service.price}р  </td>
                            <td style={{textAlign:'left'}}>{(service.action)?
                                <button className='button_delete' onClick={e=>{service.action=false; setServiceUpdate(!serviceUpdate)}}>Удалить</button>:
                                <button className='button_add' onClick={e=>{service.action=true; setServiceUpdate(!serviceUpdate)}}>Добавить</button>}
                            </td>
                        </tr>
                    )}
                </table>}
            </div>
            <div className='row_button'>
                {dateError&& <div className='error_massege'>Комната в это время уже забронирована или занята!</div>}
                <button className="button_add" onClick={submitOnClick}>{(booking!=null)?'Подтвердить изменения':'Создать'}</button>
                {!isCreate&& <button className="button_delete" onClick={onClickDeleteButton}>Удалить</button>}
                <button className="button_common" onClick={e=>{setIsCreate(false); setSelectedBooking(0)}}>Отмена</button>
            </div>
        </div>
    );
};

export default AdminBookingFullCard;