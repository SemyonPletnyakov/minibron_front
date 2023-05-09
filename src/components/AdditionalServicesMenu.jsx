import React, { useEffect, useState } from 'react';
import globalHotelId from '..';
import ServicesRequests from '../API/ServicesRequests';
import AdditionalServicesCard from './AdditionalServicesCard';

const AdditionalServicesMenu = ({ backToRoom, setSelectedServices, selectedServices, goToBooking}) => {

    const [allServices, setAllServices] = useState([]);

    async function loadAllService(){
        setSelectedServices([]);
        setAllServices(await ServicesRequests.getAll(globalHotelId))
    }
    useEffect(()=>{
        loadAllService()
    },[]);

    const clickOnBackButton = (e) =>{
        e.preventDefault();
        backToRoom();
    };
    const clickOnBookingButton = (e) =>{
        e.preventDefault();
        goToBooking();
    };
    return (
        <div className='service_menu'>
            <div className="button_back_left">
                <button className='button_common' onClick={clickOnBackButton}>Назад</button>
            </div>
            <div><b>Дополнительные услуги</b></div>
            <div>
                {allServices.map((service)=>
                                <AdditionalServicesCard service = {service} setSelectedServices={setSelectedServices} selectedServices = {selectedServices}/>
                            )
                }
            </div>
            <div className='button_next_right'><button className='button_common' onClick={clickOnBookingButton}>Далее</button></div>
        </div>
    );
};

export default AdditionalServicesMenu;