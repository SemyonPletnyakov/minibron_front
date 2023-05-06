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

const AdminBookingFullCard = ({booking,isCreate,setIsCreate,setSelectedBooking}) => {
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
                d:x.id, 
                oldId: booking?.servicesForBookings.find(y=>y.additionalServiceId==x.id)?.id ?? 0,
                title: x.title, 
                price: x.price, 
                action: booking?.servicesForBookings.find(y=>y.additionalServiceId==x.id)!=null
            })));
        
        const roomResult = await RoomsRequests.getAllRooms(cookies?.token);
        setRoomData(roomResult);
        if(typeof roomResult.filter(x=>x.id==roomId) != "undefined")
            setMainRoom(roomResult.filter(x=>x.id==roomId) ?? mainRoom);
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
            },cookies?.token);
            if(response){
                for (let i = 0; i < servicesData.length; i++) {
                    console.log(servicesData[i].oldId>0);
                    if(servicesData[i].oldId>0 && !servicesData[i].action)
                        BookingsRequests.deleteBookingServiceById({id:servicesData[i].oldId}, cookies?.token);
                    if(servicesData[i].oldId==0 && servicesData[i].action)
                        BookingsRequests.newBookingService(servicesData[i].id, bookingId, globalHotelId);
                }
               
            }
        }
        else{
            let dateCheck = await RoomsRequests.getActual(
                                moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                mainRoom.capacity,globalHotelId);
                                console.log(dateCheck.find(x=>x.id==roomId))
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
                            BookingsRequests.newBookingService(servicesData[i].id, response, globalHotelId);
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
        await BookingsRequests.deleteBookingById({id:bookingId}, cookies?.token);
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
        <div>
            <div>
                <div>
                    {(!changedRoom && mainRoom.id!=0) &&
                            <div>
                                <span>Текущий номер: {mainRoom.title} Вместимость:{mainRoom.capacity} Цена в день:{mainRoom.price}р</span>
                                <button onClick={e=>setChenagedRoom(true)}>Сменить номер</button> 
                            </div>}
                    {(mainRoom.id==0)&&
                        <button onClick={e=>setChenagedRoom(true)}>Выбрать номер</button>
                    }
                    {(changedRoom)&&
                        <div>
                            <button onClick={e=>setChenagedRoom(false)}>Скрыть номера</button> 
                            <table>
                                {roomData.map(room=>
                                    <tr>
                                        <td style={{textAlign:'left'}}>{room.title}</td>
                                        <td style={{textAlign:'left'}}>  Вместимость: {room.capacity}</td>
                                        <td style={{textAlign:'left'}}>  Цена в день: {room.price}р  </td>
                                        <td style={{textAlign:'left'}}>{(room.id != roomId)?
                                            <button onClick={e=>
                                                {
                                                    setRoomId(room.id); 
                                                    setMainRoom(room);
                                                }}>Переместить в</button>
                                            :"Выбрано"}</td>
                                    </tr>
                                )}
                            </table>
                        </div>
                    }
                </div>
                <div>
                    Дата начала:
                    <input
                        placeholder="Заезд"
                        value={startDateTime}
                        onChange={handleStartChange}
                        className="text-field__input"
                    />
                    Дата конца: 
                    <input
                        placeholder="Выезд"
                        value={endDateTime}
                        onChange={handleEndChange}
                        className="text-field__input"
                    />
                    <DayPicker locale={ru}
                        mode="range"
                        selected={selectedRange}
                        onSelect={handleRangeSelect}                        
                    />
                </div>
                <div>
                    <div>Данные клиента</div>
                    <div>ФИО</div>
                    <input onChange={e=>setFio(e.target.value)} value={fio}></input>
                    <div>E-mail</div>
                    <input onChange={e=>setEmail(e.target.value)} value={email}></input>
                    <div>Мобильный телефон</div>
                    <input onChange={e=>setPhone(e.target.value)} value={phone}></input>
                </div>
                <div>
                    {(serviceUpdate || !serviceUpdate)&&
                    <table>
                        {servicesData.map(service=>
                            <tr>
                                <td style={{textAlign:'left'}}>{service.title}</td>
                                <td style={{textAlign:'left'}}>  Цена: {service.price}р  </td>
                                <td style={{textAlign:'left'}}>{(service.action)?
                                    <button onClick={e=>{service.action=false; setServiceUpdate(!serviceUpdate)}}>Удалить</button>:
                                    <button onClick={e=>{service.action=true; setServiceUpdate(!serviceUpdate)}}>Добавить</button>}
                                </td>
                            </tr>
                        )}
                    </table>}
                </div>
                {dateError&& <div>Комната в это время уже забронирована или занята!</div>}
                <button onClick={submitOnClick}>{(booking!=null)?'Подтвердить изменения':'Создать'}</button>
                {!isCreate&& <button onClick={onClickDeleteButton}>Удалить</button>}
                <button onClick={e=>{setIsCreate(false); setSelectedBooking(0)}}>Отмена</button>
            </div>
        </div>
    );
};

export default AdminBookingFullCard;