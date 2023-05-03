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
            setUserData(result.data.fio, result.data.role, result.data.jwtToken);
            setCookie("token", "Bearer "+ result.data.jwtToken, { path: "/" });
            setFailLogin(false);
        } else {
            removeUserData();
            setFailLogin(true);
        }
    }

    async function exitButtonOnClick  (e){
        e.preventDefault();
        removeUserData();
    }

    return (
        <div>
            <span>Логин</span>
            <input type="text" onChange={onChangeInputLogin}/>
            <span>Пароль</span>
            <input type="password" onChange={onChangeInputPassword}/>
            <button onClick={onClickButtonLogin}>Войти</button>
            {failLogin&&
                <span style={{color:"red"}}>Неверный логин или пароль</span>
            }
            <button onClick={exitButtonOnClick}>Выйти</button>
        </div>
    );
};

export default Login;