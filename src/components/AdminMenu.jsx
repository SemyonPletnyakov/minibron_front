import React from 'react';
import AdminComponentsEnum from '../Common/AdminComponentsEnum';

const AdminMenu = ({setActiveComponent, role, exitButtonOnClick}) => {
    return (
        <div className='admin_upper_menu'>
            <div className='admin_main_menu'>
                <button className='button_menu_left' onClick={(e=>{setActiveComponent(AdminComponentsEnum.RoomsMenu)})}>Номера</button>
                <button className='button_menu' onClick={(e=>{setActiveComponent(AdminComponentsEnum.ServicesMenu)})}>Дополнительные услуги</button>
                <button className='button_menu' onClick={(e=>{setActiveComponent(AdminComponentsEnum.BookingsMenu)})}>Бронирования</button>
                <button className='button_menu' onClick={(e=>{setActiveComponent(AdminComponentsEnum.SessionsMenu)})}>Заселённые комнаты</button>
                {role=="admin"&&
                    <button className='button_menu' onClick={(e=>{setActiveComponent(AdminComponentsEnum.AccountsMenu)})}>Учётные записи</button>
                }
                <button className='button_menu' onClick={(e=>{setActiveComponent(AdminComponentsEnum.YourAccountsMenu)})}>Моя учётная запись</button>
            </div>
            <button className='button_menu_exit' onClick={exitButtonOnClick}>Выйти</button>
        </div>
    );
};

export default AdminMenu;