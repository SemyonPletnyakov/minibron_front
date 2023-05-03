import React, { useState } from 'react';
import Login from './components/Login';
import { useCookies } from "react-cookie";
import AccountRequests from './API/AccountRequests';

const AppAdmin = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [isLogged, setIsLogged] = useState(false);
    const [jwt, setJwt] = useState("");
    const [role, setRole] = useState("");
    const [fio, setFio] = useState("");
    
    const setUserData = (_fio, _role, _jwt)=>{
        //setCookie("token", "Bearer "+ _jwt, { path: "/" });
        setJwt(_jwt);
        setFio(_fio);
        setRole(_role);
        setIsLogged(true);
    }
    function removeUserData (){
        try {
            AccountRequests.Login(0,0,0);//без понятия что тут за колдунство, но без впереди стоящего запроса он не хочет работать
        } catch (error) {
            
        }
        
        setJwt("");
        setFio("");
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
            {!false&&
                <Login  setUserData={setUserData} removeUserData={removeUserData} />
            }
            {isLogged&&
                <button onClick={exitButtonOnClick}>Выйти</button>








            }
        </div>
    );
};

export default AppAdmin;