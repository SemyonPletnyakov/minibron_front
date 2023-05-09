import React, { useState } from 'react';
import { ru } from 'date-fns/locale'
import 'react-day-picker/dist/style.css';
import { format, isAfter, isBefore, isValid, parse } from 'date-fns';
import { DayPicker, SelectRangeEventHandler} from 'react-day-picker';
import RoomsRequests from '../API/RoomsRequests';
import moment from 'moment/moment';
import '../styles/main.css';
import globalHotelId from '..';

const DateForm = ({startDate, setStartDate, endDate, setEndDate, findRooms}) => {
    const [selectedRange, setSelectedRange] = useState({});
    const [startViewDate, setStartViewDate] = useState("");
    const [endViewDate, setEndViewDate] = useState("");
    const [capasity, setCapacity] = useState();
    
    //--работа с датами
    const handleStartChange = (e) =>{
        setStartViewDate(e.target.value);
        setStartDate(moment(e.target.value, 'DD.MM.YYYY').format('YYYY-MM-DD'));
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
        setEndViewDate(e.target.value);
        setEndDate(moment(e.target.value, 'DD.MM.YYYY').format('YYYY-MM-DD'));
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
            setStartViewDate(format(range.from, 'dd.MM.y'));
            setStartDate(format(range.from, 'y-MM-dd'));
        } else {
            setStartViewDate('');
            setStartDate('');
        }
        if (range?.to) {
            setEndViewDate(format(range.to, 'dd.MM.y'));
            setEndDate(format(range.to, 'y-MM-dd'));
        } else {
            setEndViewDate('');
            setEndDate('');
        }
      };
      //--конец работы с датами

    const handleCapacityChange = (e) => {
        setCapacity(+e.target.value);
    }
    async function findRoom(e) {
        e.preventDefault();
        //RoomsRequests.getActual(parse(startDate, 'y-MM-dd', new Date()),parse(endDate, 'y-MM-dd', new Date()), capasity, 1);
        //setRoomsData(RoomsRequests.getActual(startDate,endDate, capasity, 1));
        findRooms(await RoomsRequests.getActual(startDate,endDate, capasity, globalHotelId));
    }
    return (
        <div className="date_form">
          <div>Найти номер</div>
          <div className="space-around">
            <input
                placeholder="Заезд"
                value={startViewDate}
                onChange={handleStartChange}
                className="text-field__input"
            />
            <input
                placeholder="Выезд"
                value={endViewDate}
                onChange={handleEndChange}
                className="text-field__input"
            />
            <input
                placeholder="Кол. гостей"
                value={capasity}
                type="number"
                onChange={handleCapacityChange}
                className="text-field__input"
            />
            <button className="button_common" onClick={findRoom}>Найти</button>
          </div>
            <DayPicker locale={ru}
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeSelect}
                className="day_picker"
                
            />
        </div>
    );
};

export default DateForm;