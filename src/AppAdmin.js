import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import { useCookies } from "react-cookie";
import AccountRequests from './API/AccountRequests';
import AdminMenu from './components/AdminMenu';
import AdminComponentsEnum from './Common/AdminComponentsEnum';
import AdminRoomMenu from './components/AdminRoomMenu';
import AdminServicesMenu from './components/AdminServicesMenu';
import AdminBookingMenu from './components/AdminBookingMenu';
import SessionMenu from './components/SessionMenu';
import AccountsMenu from './components/AccountsMenu';
import YourAccount from './components/YourAccount';
import './styles/main.css';

const AppAdmin = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [isLogged, setIsLogged] = useState(false);
    const [jwt, setJwt] = useState("");
    const [role, setRole] = useState("");
    const [fio, setFio] = useState("");
    const [login, setLogin] = useState("");
    const [activeComponent, setActiveComponent] = useState(0);
    useEffect(()=>{
        loadAccData();
    },[])
    async function loadAccData(){
        const response = await AccountRequests.getAccInfo(cookies?.token);
        if(response!=null){
            console.log(response)
            let _jwt = cookies?.token;
            setUserData(response.fio,response.role,response.login ,_jwt)
        }
        else{
            removeUserData()
        }
    }


    const setUserData = (_fio, _role, _login,_jwt)=>{
        //setCookie("token", "Bearer "+ _jwt, { path: "/" });
        setJwt(_jwt);
        setFio(_fio);
        setLogin(_login);
        setRole(_role);
        setIsLogged(true);
    }
    function removeUserData (){
        try {
            AccountRequests.Login(0,0,0);//без понятия что тут за колдунство, но без впереди стоящего запроса он не хочет работать. 
            //В Login есть метод с впереди стоящим запросом всё работало, а кнопка выхода не работала.
        } catch (error) {
            
        }
        
        setJwt("");
        setFio("");
        setLogin("");
        setRole("");
        removeCookie("token", { path: "/" });
        setIsLogged(false);
    }

    async function exitButtonOnClick  (e){
        e.preventDefault();
        removeUserData();
        removeCookie("token");
    }

    return (
        <div>
            {!isLogged&&
                <Login  setUserData={setUserData} removeUserData={removeUserData} />
            }
            {isLogged&&
            <div className='admin_page'>   
                <AdminMenu exitButtonOnClick={exitButtonOnClick} setActiveComponent={setActiveComponent} role={role}/>
                {activeComponent== AdminComponentsEnum.RoomsMenu&&
                    <AdminRoomMenu role={role}/>
                }
                {activeComponent== AdminComponentsEnum.ServicesMenu&&
                    <AdminServicesMenu role={role}/>
                }
                {activeComponent== AdminComponentsEnum.BookingsMenu&&
                    <AdminBookingMenu role={role}/>
                }
                {activeComponent== AdminComponentsEnum.SessionsMenu&&
                    <SessionMenu role={role}/>
                }
                {activeComponent == AdminComponentsEnum.AccountsMenu&&
                    <AccountsMenu role={role}/>
                }
                {activeComponent == AdminComponentsEnum.YourAccountsMenu&&
                    <YourAccount role={role} fio={fio} login={login} />
                }
            </div>
            }
        </div>
    );
};

export default AppAdmin;