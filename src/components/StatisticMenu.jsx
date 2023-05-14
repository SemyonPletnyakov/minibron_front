import React from 'react';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import moment from 'moment/moment';
import { format, isAfter, isBefore, isValid, parse } from 'date-fns';
import { DayPicker, SelectRangeEventHandler} from 'react-day-picker';
import { ru } from 'date-fns/locale'
import StatisticTypeEnum from '../Common/StatisticTypeEnum';
import StaticsticViewEnum from '../Common/StaticsticViewEnum';
import "chart.js/auto";  
import { Bar } from 'react-chartjs-2';
import StatisticsRequests from '../API/StatisticsRequests';

const StatisticMenu = () => {
    const[startDateTime, setStartDateTime] = useState("");
    const[endDateTime, setEndDateTime] = useState("");
    const [selectedRange, setSelectedRange] = useState({});
    const [staticticType, setStatisticType] = useState(StatisticTypeEnum.Income);
    const [notNullView, setNotNullView] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    //const [staticticView, setStatisticView] = useState(StaticsticViewEnum.Bar);
    const [barChartData, setBarChartData] = useState({
        labels:['1','2'],
        datasets:[
            {
                label: "fff",
                data: [1,2],
                borderWidth: 1
            }
        ]
    })
    const [titleStat, setTitleStat] = useState("Статистика дохода по месяцам");

    async function getStatistic(e){
        let response;

        if(staticticType == StatisticTypeEnum.Income) 
            response = await StatisticsRequests.getIncome(
                moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                cookies?.token
            )

        else if(staticticType == StatisticTypeEnum.NumberBooking) 
            response = await StatisticsRequests.getCountBookings(
                moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                cookies?.token
            )

        else if(staticticType == StatisticTypeEnum.NumberBookingRooms) 
            response = await StatisticsRequests.getCountBokingsRooms(
                moment(startDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                moment(endDateTime, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                cookies?.token
            )

        
        if(response != null){
            if(staticticType == StatisticTypeEnum.Income) 
            {
                setBarChartData({
                    labels:response.map(x=>x.monthAndYear),
                    datasets:[
                        {
                            label: "Доход",
                            data: response.map(x=>x.income),
                            borderWidth: 1
                        }
                    ]
                });
                setTitleStat("Статистика дохода по месяцам");
                setNotNullView(true);
            }
            if(staticticType == StatisticTypeEnum.NumberBooking) 
            {
                setBarChartData({
                    labels:response.map(x=>x.monthAndYear),
                    datasets:[
                        {
                            label: "Число бронирований",
                            data: response.map(x=>x.count),
                            borderWidth: 1
                        }
                    ]
                });
                setTitleStat("Статистика бронирвований по месяцам");
                setNotNullView(true);
            }
            if(staticticType == StatisticTypeEnum.NumberBookingRooms) 
            {
                setBarChartData({
                    labels:response.map(x=>x.roomName),
                    datasets:[
                        {
                            label: "Число бронирований",
                            data: response.map(x=>x.count),
                            borderWidth: 1
                        }
                    ]
                });
                setTitleStat("Общая статистика бронирований по номерам");
                setNotNullView(true);
            }
        }
        else setNotNullView(false);
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
                <div className='admin_room_menu'>
                    <div className='margin_bottom'>
                        <div>Выбор отчётности</div>
                        <label className='select'>
                            <select defaultValue={staticticType} onChange={e=>setStatisticType(e.target.value)}>
                                        <option value = {StatisticTypeEnum.Income}>Статистика дохода по месяцам</option>
                                        <option value = {StatisticTypeEnum.NumberBooking}>Статистика бронирвований по месяцам</option>
                                        <option value = {StatisticTypeEnum.NumberBookingRooms}>Общая статистика бронирований по номерам</option>
                            </select>
                        </label>
                    </div>
                    <div className='margin_bottom'>
                        <span> Дата начала:</span>
                        <input
                            placeholder="Заезд"
                            value={startDateTime}
                            onChange={handleStartChange}
                            className="text-field__input"
                        />
                    </div>
                    <div className='margin_bottom'>
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
                    <button className='button_common' onClick={getStatistic}>Получить статистику</button>
                </div>
                {notNullView&&
                    <div className='statistic_body'>
                        <Bar
                            type="bar"
                            width={800}
                            height={400}
                            options={{
                                responsive: true,
                                plugins:{
                                    title: {
                                        display: true,
                                        text: titleStat,
                                        fontSize: "30px"
                                    },
                                    legend: {
                                        display: false
                                    }
                                }
                            }}
                            data={barChartData}
                        />
                    </div>
                }
        </div>
    );
};

export default StatisticMenu;