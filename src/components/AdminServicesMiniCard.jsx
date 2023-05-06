import React from 'react';
import ServicesRequests from '../API/ServicesRequests';

const AdminServicesMiniCard = ({service, setSelectedService, role}) => {
    function clickOnRoom (e){
        e.preventDefault();
        setSelectedService(service.id)
    }

    return (
        <div>            
            <img src={ServicesRequests.getPictureLink(1,service.pictureName)} alt="Картинка сервиса"/>
            <div>{service.title}</div>
            <div>{service.description}</div>
            <div>Цена: {service.price==0? ('Бесплатно') : (service.price+'р')}</div>
            {role=='admin'&&<button className='button_common' onClick={clickOnRoom}>Изменить</button>}

        </div>
    );
};

export default AdminServicesMiniCard;