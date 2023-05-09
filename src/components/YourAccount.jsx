import React from 'react';

const YourAccount = ({role,fio,login}) => {
    return (
        <div className='admin_room_menu'>
            <div className='your_account_cards'>
                <div>Данные об аккаунте:</div>
                <table>
                    
                    <tr>
                        <td style={{textAlign:'left'}}>ФИО:</td> 
                        <td style={{textAlign:'left'}}>{fio}</td>
                    </tr>
                    <tr>
                        <td style={{textAlign:'left'}}>Роль:</td> 
                        <td style={{textAlign:'left'}}>{(role=="admin"?"Администратор":"Пользователь")}</td> 
                    </tr>
                    <tr>
                        <td style={{textAlign:'left'}}>Логин: </td> 
                        <td style={{textAlign:'left'}}>{login}</td> 
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default YourAccount;