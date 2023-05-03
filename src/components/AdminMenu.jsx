import React from 'react';
import AdminComponentsEnum from '../Common/AdminComponentsEnum';

const AdminMenu = ({setActiveComponent, role}) => {
    return (
        <div>
            <button onClick={(e=>{setActiveComponent(AdminComponentsEnum.RoomsMenu)})}>Номера</button>
            <button onClick={(e=>{setActiveComponent(AdminComponentsEnum.ServicesMenu)})}>Дополнительные услуги</button>
            <button onClick={(e=>{setActiveComponent(AdminComponentsEnum.BookingsMenu)})}>Бронирования</button>
            <button onClick={(e=>{setActiveComponent(AdminComponentsEnum.SessionsMenu)})}>Заселённые комнаты</button>
            {role=="admin"&&
                <button onClick={(e=>{setActiveComponent(AdminComponentsEnum.AccountsMenu)})}>Учётные записи</button>
            }
            <button onClick={(e=>{setActiveComponent(AdminComponentsEnum.YourAccountsMenu)})}>Моя учётная запись</button>
        </div>
    );
};

export default AdminMenu;