import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import SessionRequests from '../API/SessionRequests';
import SessionFullCard from './SessionFullCard';
import SessionMiniCard from './SessionMiniCard';

const SessionMenu = ({role}) => {
    const [sessionData, setSessionData] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [selectedSession, setSelectedSession] = useState(0);
    const [isCreate, setIsCreate] = useState(false);

    useEffect(()=>{
        loadData();
    },[isCreate,selectedSession])

    async function loadData(){
        await setSessionData(await SessionRequests.getActual(cookies?.token));
    }

    return (
        <div>
            {(selectedSession==0&&!isCreate)?
                (<div className='admin_room_menu'>
                    <button className='button_add' onClick={e=>setIsCreate(true)}>Добавить</button>
                    {sessionData.map(session=>
                        <SessionMiniCard session={session} setSelectedSession={setSelectedSession} role={role}/>
                    )}
                </div>)
                :
                (<SessionFullCard session={sessionData.find(item=>item.id==selectedSession)} isCreate={isCreate} setIsCreate={setIsCreate} setSelectedSession={setSelectedSession}/>)
            }
        </div>
    );
};

export default SessionMenu;