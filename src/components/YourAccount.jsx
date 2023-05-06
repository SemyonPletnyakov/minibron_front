import React from 'react';

const YourAccount = ({role,fio,login}) => {
    return (
        <div>
            <table>
                <tr><td colspan="2" style={{textAlign:'center'}}>Данные об аккаунте:</td></tr>
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
    );
};

export default YourAccount;