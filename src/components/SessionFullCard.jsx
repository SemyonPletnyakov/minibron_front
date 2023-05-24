import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import SessionRequests from '../API/SessionRequests';
import RoomsRequests from '../API/RoomsRequests';
import ServicesRequests from '../API/ServicesRequests';
import 'react-day-picker/dist/style.css';
import moment from 'moment/moment';
import { format, isAfter, isBefore, isValid, parse } from 'date-fns';
import { DayPicker, SelectRangeEventHandler} from 'react-day-picker';
import { ru } from 'date-fns/locale'
import globalHotelId from '..';

const SessionFullCard = ({session,isCreate,setIsCreate,setSelectedSession, jwt}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const [sessionId, setSessionId] = useState(!isCreate&& session!=null? session.id : 0);
    const[roomId, setRoomId] = useState(!isCreate&& session!=null? session.roomId : 0);
    const[startDateTime, setStartDateTime] = useState(!isCreate&& session!=null? moment(session.startDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY') : "");
    const[endDateTime, setEndDateTime] = useState(!isCreate&& session!=null? (session.endDateTime!=null ? moment(session.endDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY'):null ): "");
    const [selectedRange, setSelectedRange] = useState(!isCreate&& session!=null? {from: parse(moment(session.startDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY'), 'dd.MM.y', new Date()), to:(session.endDateTime!=null ?
                                                                                                                            parse(moment(session.endDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY'), 'dd.MM.y', new Date())
                                                                                            :(new Date()>moment(session.startDateTime, 'YYYY-MM-DD')?new Date():parse(moment(session.startDateTime, 'YYYY-MM-DD').format('DD.MM.YYYY'), 'dd.MM.y', new Date())))} : {});
    
    const [fio, setFio] = useState(!isCreate&& session!=null? session.fio : "");
    const [email, setEmail] = useState(!isCreate&& session!=null? session.phone : "");
    const [phone, setPhone] = useState(!isCreate&& session!=null? session.email : "");
    const [services, setServices] = useState(!isCreate&& session!=null? session.servicesForSessions.map(x=>x.id) : []);
    const [selectedRoom, setSelectedRoom] = useState(false);
    const [changedRoom, setChenagedRoom] = useState(false);
    const [mainRoom, setMainRoom] = useState({id:0})
    const [serviceUpdate, setServiceUpdate] = useState(false);

    const [roomData, setRoomData] = useState([]);
    const [servicesData, setServicesData] = useState([]);

    const[dateError, setDateError] = useState(false);
    const[roomPrice, setRoomPrice] = useState(!isCreate&& session!=null? session.actualPriceForRoom : 0);

    useEffect(()=>{
        loadData();
    },[])

    async function loadData(){
        const serviceResult = await ServicesRequests.getAll(globalHotelId);
        setServicesData(serviceResult.map(x=>(
            {
                id:x.id, 
                oldId: session?.servicesForSessions.find(y=>y.additionalServiceId==x.id)?.id ?? 0,
                title: x.title, 
                actualPrice: session?.servicesForSessions.find(y=>y.additionalServiceId==x.id)!=null ? session?.servicesForSessions.find(y=>y.additionalServiceId==x.id).actualPrice : x.price, 
                action: session?.servicesForSessions.find(y=>y.additionalServiceId==x.id)!=null
            })));
        
        const roomResult = await RoomsRequests.getAllRooms(jwt);
        let sortedRoomResult = roomResult.map(x=>(
            {
                id:x.id, 
                title: x.title, 
                capacity: x.capacity,
                price: ((session?.actualPriceForRoom!=null)&&(x.id==roomId)) ? session?.actualPriceForRoom : x.price
            }))
            console.log(sortedRoomResult)
        setRoomData(sortedRoomResult);
        if(typeof sortedRoomResult.find(x=>x.id==roomId) != "undefined")
            setMainRoom(sortedRoomResult.find(x=>x.id==roomId) ?? mainRoom);

        console.log(servicesData)
        console.log(mainRoom)
    }
    async function submitOnClick(e){
        
        let response;
        
        if(!isCreate){
            console.log({
                id:sessionId,
                roomId: roomId,
                startDateTime: moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                endDateTime: (endDateTime===''||endDateTime=='Invalid date')?null: (moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD')=='Invalid date'?null:moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD')),
                fio: fio,
                phone: phone,
                email: email,
                actualPriceForRoom: roomPrice
            })
            response = await SessionRequests.updateSession({
                id:sessionId,
                roomId: roomId,
                startDateTime: moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                endDateTime: (endDateTime===''||endDateTime=='Invalid date')?null: (moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD')=='Invalid date'?null:moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD')),
                fio: fio,
                phone: phone,
                email: email,
                actualPriceForRoom: roomPrice
            },jwt);
            if(response){
                for (let i = 0; i < servicesData.length; i++) {
                    console.log(servicesData[i].oldId>0);
                    if(servicesData[i].oldId>0)
                        await SessionRequests.deleteSessionServiceById({id:servicesData[i].oldId}, jwt);
                    if(servicesData[i].action)
                        SessionRequests.createSessionService({
                            sessionsId: sessionId,
                            additionalServiceId: servicesData[i].id,
                            actualPrice: servicesData[i].actualPrice
                        },jwt);
                        console.log({
                            sessionsId: sessionId,
                            additionalServiceId: servicesData[i].id,
                            actualPrice: servicesData[i].actualPrice
                        })
                }
               
            }
        }
        else{
            let end = (endDateTime===''||endDateTime=='Invalid date')?null: (moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD')=='Invalid date'?null:moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'))
            if(end==null && startDateTime > new Date()) end = startDateTime;
            else if(end==null) end = new Date();



            let dateCheck = await RoomsRequests.getActual(
                                moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                end,
                                mainRoom.capacity,globalHotelId);
                                console.log(dateCheck.find(x=>x.id==roomId))
            if(!dateCheck.find(x=>x.id==roomId) || (typeof dateCheck.find(x=>x.id==roomId) == "undefined")){
                setDateError(true);
            }
            else{
                response = await SessionRequests.createSession({
                                        roomId: mainRoom.id,
                                        startDateTime: moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                        endDateTime: (endDateTime===''||endDateTime=='Invalid date')?null: (moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD')=='Invalid date'?null:moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD')),
                                        fio: fio,
                                        phone: phone,
                                        email: email,
                                        actualPriceForRoom: mainRoom.price
                                    },jwt);
                if(response>0){
                    for (let i = 0; i < servicesData.length; i++) {
                        if(servicesData[i].oldId==0 && servicesData[i].action)
                            SessionRequests.createSessionService({
                                sessionsId: response,
                                additionalServiceId: servicesData[i].id,
                                actualPrice: servicesData[i].actualPrice
                            },jwt);
                    }
                    setDateError(false);
                    setSessionId(response);
                    setIsCreate(false);
                    setSelectedSession(response);
                }
            }
        }
         
    }
    async function onClickDeleteButton(e){
        console.log({id:sessionId})
        await SessionRequests.deleteSessionById({id:sessionId}, jwt);
        setIsCreate(false);
        setSelectedSession(0);
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
                                <span className='margin_bottom'>Текущий номер: {mainRoom.title} </span>
                                <span className='margin_bottom'>Вместимость: {mainRoom.capacity} </span>
                                <div className='margin_bottom'>
                                    <span>Цена в день</span>
                                    <input 
                                        className="text-field__input"
                                        type="number"
                                        defaultValue={mainRoom.price} 
                                        onChange={e=>{setRoomPrice(+e.target.value); mainRoom.price=+e.target.value}}>
                                    </input> 
                                </div>
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
                                        <td style={{textAlign:'left'}}>  Цена в день:   </td>
                                        <td style={{textAlign:'left'}}>  
                                            {room.id != roomId? 
                                                room.price :
                                                <input 
                                                    className="text-field__input"
                                                    type="number"
                                                    defaultValue={room.price} 
                                                    onChange={e=>{room.price=+e.target.value}}>
                                                </input> 
                                            }
                                        </td>
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
                <div className='margin_bottom'>Данные клиента</div>
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
                                <td style={{textAlign:'left'}}> Цена: </td>
                                <td style={{textAlign:'left'}}>
                                    {service.action? 
                                        <input 
                                            className="text-field__input"
                                            type="number"
                                            defaultValue={service.actualPrice} 
                                            onChange={e=>{service.actualPrice=+e.target.value}}>
                                        </input> :
                                        service.actualPrice
                                    } 
                                </td>
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
                    <button className="button_add" onClick={submitOnClick}>{(session!=null)?'Подтвердить изменения':'Создать'}</button>
                    {!isCreate&& <button className="button_delete" onClick={onClickDeleteButton}>Удалить</button>}
                    <button className="button_common" onClick={e=>{setIsCreate(false); setSelectedSession(0)}}>Отмена</button>
                </div>
            </div>
    );
};

export default SessionFullCard;