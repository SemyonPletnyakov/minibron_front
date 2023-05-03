import React, { useEffect, useState } from 'react';
import globalHotelId from '..';
import ServicesRequests from '../API/ServicesRequests';
import AdditionalServicesCard from './AdditionalServicesCard';

const AdditionalServicesMenu = ({ backToRoom, setSelectedServices, selectedServices, goToBooking}) => {

    const [allServices, setAllServices] = useState([]);

    async function loadAllService(){
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
        <div>
            <button onClick={clickOnBackButton}>Назад</button>
            <div>Дополнительные услуги</div>
            <div style={{justifyContent: 'flex-start'}}>
                {allServices.map((service)=>
                                <AdditionalServicesCard service = {service} setSelectedServices={setSelectedServices} selectedServices = {selectedServices}/>
                            )
                }
            </div>
            <button onClick={clickOnBookingButton}>Далее</button>
        </div>
    );
};

export default AdditionalServicesMenu;