import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import AccountRequests from '../API/AccountRequests';
import AccountsMiniCard from './AccountsMiniCard';

const AccountsMenu = ({role, jwt}) => {
    const [usersData, setUsersData] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(()=>{
        loadData()
    },[])

    async function loadData(){
        let response= await AccountRequests.getAllUsers(jwt)
        await setUsersData(response.map(x=>({
            id: x.id,
            fio: x.fio,
            role: x.role,
            login: x.login,
            password: x.password,
            isChange: false
        })));
    }
    

    return (
        <div>
            {isUpdated||!isUpdated &&
            <div className='admin_room_menu'>
                <button className='button_add' onClick={e=>setUsersData([{
                                id: 0,
                                fio: "",
                                role: "user",
                                login: "",
                                password: "",
                                isChange: false
                            },...usersData])}>Добавить</button>
                {usersData.map((user, index)=>
                    <AccountsMiniCard jwt={jwt} user={user} role={role} usersData={usersData} setUsersData={setUsersData} index={index} setIsUpdatedData={setIsUpdated} isUpdatedDate={isUpdated}/>
                )}
            </div>
            }
        </div>
    );
};

export default AccountsMenu;