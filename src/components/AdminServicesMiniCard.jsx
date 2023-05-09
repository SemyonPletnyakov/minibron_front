import React from 'react';
import ServicesRequests from '../API/ServicesRequests';

const AdminServicesMiniCard = ({service, setSelectedService, role}) => {
    function clickOnRoom (e){
        e.preventDefault();
        setSelectedService(service.id)
    }

    return (
        <div className='admin_room_card'>            
            <img className='service_img' src={ServicesRequests.getPictureLink(1,service.pictureName)} alt="Картинка сервиса"/>
            <div className='service_main'>
                <div className='margin_bottom'>{service.title}</div>
                <div className='margin_bottom'>{service.description}</div>
                <div className='margin_bottom'>Цена: {service.price==0? ('Бесплатно') : (service.price+'р')}</div>
                {role=='admin'&&<button className='button_common' onClick={clickOnRoom}>Изменить</button>}
            </div>

        </div>
    );
};

export default AdminServicesMiniCard;