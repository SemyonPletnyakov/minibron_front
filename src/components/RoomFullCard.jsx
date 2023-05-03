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
        <div>
            <button onClick={clickOnBackButton}>Назад</button>
            <div>{room.title}</div>
            {(images!=0)&&
                <SimpleImageSlider
                    width={896}
                    height={504}
                    images={images}
                    showBullets={true}
                    showNavs={true}
                />
            
            }
            <div>
                <div>
                    <div>Описание:</div>
                    <div>{room.description}</div>
                </div>
                <div>
                    <div>Вместимость/число коек: {room.capacity}</div>
                    <div>Цена в день: {room.price}р</div>
                    <button onClick={clickOnBookingButton}>Забронировать номер</button>
                </div>
            </div>
        </div>
    );
};

export default RoomFullCard;