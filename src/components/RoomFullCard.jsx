import React, { useEffect, useState } from 'react';
import SimpleImageSlider from "react-simple-image-slider";
import globalHotelId from '..';
import RoomsRequests from '../API/RoomsRequests';

const RoomFullCard = ({room, backToRoomsMenu, goToServices}) => {

    const [images, setImages] = useState([]);
    async function loadImageData(){
        /*setImages(await RoomsRequests.getRoomPicturesData(room.id).sort( (a, b) => a.numberOnTheList - b.numberOnTheList ).map((item)=>({url:RoomsRequests.getPictureLink(1,room.id,item.name)})))*/
        const response = await RoomsRequests.getRoomPicturesData(room.id);
        let t = response.sort( (a, b) => a.numberOnTheList - b.numberOnTheList ).map((item)=>({url:RoomsRequests.getPictureLink(globalHotelId,room.id,item.name)}))
        console.log(t)
        setImages(t)
    }
    useEffect(()=>{
        loadImageData()
    },[])
    const clickOnBookingButton = (e) =>{
        e.preventDefault();
        goToServices();
    }
    const clickOnBackButton = (e) =>{
        e.preventDefault();
        backToRoomsMenu();
    }
    return (
        <div className='room_fullcard'>
            <div className="button_back_left">
                <button className='button_common' onClick={clickOnBackButton}>Назад</button>
            </div>
            {(images!=0)&&
                <SimpleImageSlider
                    width={896}
                    height={504}
                    images={images}
                    showBullets={true}
                    showNavs={true}
                />
            
            }
            <div className='room_fullcard_body'>
                <div className='room_fullcard_descriprtion'>
                    <div>Описание:</div>
                    <div>{room.description}</div>
                </div>
                <div className='room_fullcard_main'>
                    <div className='margin_bottom'>{room.title}</div>
                    <div className='margin_bottom'>Вместимость/число коек: {room.capacity}</div>
                    <div className='margin_bottom'>Цена в день: {room.price}р</div>
                    <div><button className='button_common' onClick={clickOnBookingButton}>Забронировать номер</button></div>
                </div>
            </div>
        </div>
    );
};

export default RoomFullCard;