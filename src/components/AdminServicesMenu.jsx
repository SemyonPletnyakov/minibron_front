import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { adminGlobalHotelId } from '..';
import ServicesRequests from '../API/ServicesRequests';
import AdminServicesFullCard from './AdminServicesFullCard';
import AdminServicesMiniCard from './AdminServicesMiniCard';

const AdminServicesMenu = ({role}) => {
    
    const [serviceData, setServiceData] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [selectedService, setSelectedService] = useState(0);
    const [isCreate, setIsCreate] = useState(false);



    useEffect(()=>{
        loadRoomsData();
    },[isCreate,selectedService])

    async function loadRoomsData(){
        await setServiceData(await ServicesRequests.getAll(adminGlobalHotelId));
    }

    return (
        <div>
            {(selectedService==0&&!isCreate)?
                (<div>
                    <button onClick={e=>setIsCreate(true)}>Добавить</button>
                    {serviceData.map(service=>
                        <AdminServicesMiniCard service={service} setSelectedService={setSelectedService} role={role}/>
                    )}
                </div>)
                :
                (<AdminServicesFullCard service={serviceData.find(item=>item.id==selectedService)} isCreate={isCreate} setIsCreate={setIsCreate} setSelectedService={setSelectedService}/>)
            }
        </div>
    );
};

export default AdminServicesMenu;