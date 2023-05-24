import React, { useState } from 'react';
import { adminGlobalHotelId } from '..';
import { useCookies } from "react-cookie";
import AccountRequests from '../API/AccountRequests';

const Login = ({setUserData, removeUserData}) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [failLogin, setFailLogin] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const onChangeInputLogin = (e)=>{
        setLogin(e.target.value);
    }
    const onChangeInputPassword = (e)=>{
        setPassword(e.target.value);
    }

    async function onClickButtonLogin(e){
        e.preventDefault();
        
        let result
        try {
            result =await AccountRequests.Login(login, password, adminGlobalHotelId);
        } catch (error) {
            
        }

        if (result?.status == 200 && result?.data?.jwtToken !=null )
        {
            setUserData(result.data.fio, result.data.role,login ,"Bearer "+ result.data.jwtToken);
            setCookie("token", "Bearer "+ result.data.jwtToken, { path: "/" });
            setFailLogin(false);
        } else {
            removeUserData();
            setFailLogin(true);
        }
    }

    return (
        <div className='login_page'>
            {failLogin&&
                <span className='error_massege'>Неверный логин или пароль</span>
            }
            <div className='login_page_pole'>
                <span>Логин </span>
                <input className="text-field__input" type="text" onChange={onChangeInputLogin}/>
            </div>
            <div className='login_page_pole'>
                <span>Пароль </span>
                <input className="text-field__input" type="password" onChange={onChangeInputPassword}/>
            </div>
            <button className='button_common' onClick={onClickButtonLogin}>Войти</button>
        </div>
    );
};

export default Login;