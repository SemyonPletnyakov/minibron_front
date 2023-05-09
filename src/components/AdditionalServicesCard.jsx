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
        <div className='service_card'>
            <div>
                <img className='service_img' src={ServicesRequests.getPictureLink(1,service.pictureName)} alt="Картинка сервиса"/>
                
            </div>
            <div className='service_main'>
                <div className='margin_bottom'>{service.title}</div>
                <div className='margin_bottom'>{service.description}</div>
                <div className='margin_bottom'>Цена: {service.price==0? ('Бесплатно') : (service.price+'р')}</div>
                {(selected)?(
                        <button className='button_delete' onClick={clickOnDeleteService}>Удалить</button>
                    )
                    :
                    (
                        <button className='button_add' onClick={clickOnAddService}>Добавить</button>
                    )
                }
            </div>
        </div>
    );
};

export default AdditionalServicesCard;