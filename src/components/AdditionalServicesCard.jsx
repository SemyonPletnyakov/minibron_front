import React, { useState } from 'react';
import ServicesRequests from '../API/ServicesRequests';

const AdditionalServicesCard = ({service, setSelectedServices, selectedServices}) => {
    const [selected, setSelected] = useState(false);

    function clickOnAddService(e){
        e.preventDefault();
        setSelected(true);
        if(selectedServices.filter(item => item.id == service.id).length==0)
            setSelectedServices([...selectedServices, service]);
    }
    function clickOnDeleteService(e){
        e.preventDefault();
        setSelected(false);
        setSelectedServices(selectedServices.filter(item => item.id != service.id));
    }

    return (
        <div>
            <div>{service.title}</div>
            <div>{service.description}</div>
            <img src={ServicesRequests.getPictureLink(1,service.pictureName)} alt="Картинка сервиса"/>
            <div>Цена: {service.price==0? ('Бесплатно') : (service.price+'р')}</div>
            {(selected)?(
                    <button onClick={clickOnDeleteService}>Удалить</button>
                )
                :
                (
                    <button onClick={clickOnAddService}>Добавить</button>
                )
            }
        </div>
    );
};

export default AdditionalServicesCard;