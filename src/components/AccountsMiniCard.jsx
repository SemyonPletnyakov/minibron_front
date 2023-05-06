import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import AccountRequests from '../API/AccountRequests';

const AccountsMiniCard = ({user,role,usersData,setUsersData, index, setIsUpdatedData,isUpdatedDate}) => {
    const[updateUserView, setUpdateuserView] = useState(false);
    const [errorLogin, setErrorLogin] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [errorDelete, setErrorDelete] = useState(false);

    async function create(e){
        console.log({
            fio:user.fio,
            role:user.role,
            login:user.login,
            password:user.password
        })
        let response = await AccountRequests.createUser({
            fio:user.fio,
            role:user.role,
            login:user.login,
            password:user.password
        },cookies?.token);
        if(response>0){
            user.id=response;
            setErrorDelete(false);
            setErrorLogin(false);
            user.isChange=false;
            setUpdateuserView(!updateUserView);
        }
        else setErrorLogin(true);
    }
    async function update(e){
        let response = await AccountRequests.changeUser({
            id: user.id,
            fio:user.fio,
            role:user.role,
            login:user.login,
            password:user.password
        },cookies?.token);
        if(response){
            setErrorDelete(false);
            setErrorLogin(false);
            user.isChange=false;
            setUpdateuserView(!updateUserView);
        }
        else errorLogin(true);
    }
    async function delete1(e){
        let response = await AccountRequests.deleteUser({
            id: user.id
        },cookies?.token);
        if(response){
            setErrorLogin(false);
            user.isChange=false;
            //setUsersData([...usersData.slice(0,index),...usersData.slice(index+1)]);
            
            setUpdateuserView(!updateUserView);
            setUsersData(usersData.filter((item,i)=>i!=index)).then(
            setIsUpdatedData(!isUpdatedDate))
        }
        else setErrorDelete(true);
    }






    return (
        
        <div>
            { (updateUserView || !updateUserView)&&
                <div>
                    <table>
                        <tr>
                            <td style={{textAlign:'left'}}>
                                ФИО:</td> 
                            <td style={{textAlign:'left'}}>{!(user.id==0||user.isChange)? user.fio:
                                        <input defaultValue={user.fio} onChange={e=>user.fio=e.target.value}></input>}</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>
                                Роль: </td> 
                            <td style={{textAlign:'left'}}>{!(user.id==0||user.isChange)? (user.role=="admin"?"Администратор":"Пользователь"):
                                        <select defaultValue={user.role} onChange={e=>user.role=e.target.value}>
                                            <option value="admin">Администратор</option>
                                            <option value="user">Пользователь</option>
                                        </select>}</td> 
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>
                                Логин: </td> 
                            <td style={{textAlign:'left'}}>{user.login}</td> 
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>
                                Пароль:</td>  
                        <td style={{textAlign:'left'}}>{!(user.id==0||user.isChange)? user.password:
                                        <input defaultValue={user.password} onChange={e=>user.password=e.target.value}></input>}</td> 
                        </tr>
                    </table>
                    {role=="admin"&&
                    <div>
                        {errorLogin&& <div>Логин уже занят</div>}
                        {errorDelete&& <div>Нельзя удалить свой аккаунт</div>}
                        {(user.id!=0&&!user.isChange)? <button onClick={e=>{ user.isChange=true; setUpdateuserView(!updateUserView);setErrorDelete(false);}}>Изменить</button>:
                            user.isChange?
                            <button onClick={update}>Подтвердить изменения</button>:
                            <button onClick={create}>Создать</button>
                        }
                        {(user.isChange)&& <button onClick={e=>{user.isChange=false; setUpdateuserView(!updateUserView);setErrorDelete(false);}}>Отменить</button>}
                        <button onClick={delete1}>Удалить</button>
                    </div>
                    }
                </div>
            }
        </div>
    );
};

export default AccountsMiniCard;