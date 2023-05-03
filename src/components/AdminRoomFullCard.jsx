import React, { useEffect, useState } from 'react';
import globalHotelId from '..';
import RoomsRequests from '../API/RoomsRequests';

const AdminRoomFullCard = ({room}) => {
    const[imageData, setImageData] = useState([]);
    const[imageOldData, setImageOldData] = useState([]);

    const[title, setTitle] = useState(room.title);
    const[description, setDescription] = useState(room.description);
    const[capacity, setCapacity] = useState(room.capacity);
    const[price, setPrice] = useState(room.price);
    const [_roomId, setRoomId] = useState(room.id);
    
    async function loadImageData(){      
        const response = await RoomsRequests.getRoomPicturesData(room.id);
        let t1 = response.sort( (a, b) => a.numberOnTheList - b.numberOnTheList ).map((item)=>(
            {
                id:item.id,
                roomId:item.roomId,
                name:item.name,
                numberOnTheList:item.numberOnTheList,
                added:false,
                url:RoomsRequests.getPictureLink(globalHotelId,room.id,item.name)
            }))
        let t2 = response.sort( (a, b) => a.numberOnTheList - b.numberOnTheList ).map((item)=>(
            {
                id:item.id,
                roomId:item.roomId,
                name:item.name,
                numberOnTheList:item.numberOnTheList,
                added:false,
                url:RoomsRequests.getPictureLink(globalHotelId,room.id,item.name)
            }))
        console.log(t1)
        setImageData(t1);
        setImageOldData(t2);
    }

    useEffect(()=>{
        loadImageData()
    },[])


    async function SortImageData(){
        setImageData(imageData.sort( (a, b) => a.numberOnTheList - b.numberOnTheList ).map(item=>item))
    }
    async function RemoveImageData(index){
        setImageData(imageData.filter((item, i)=> i!==index).map(item=>item))
    }

    function onChangeIputImage(e){
        if (!e.target.files.length) {
            return;
        }
        if (!FileReader) {
            return;
        }

        let fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        console.log(imageData)
        fileReader.onload = () => {
            setImageData(
                (imageData!==null||imageData.length!==0)?
                [...imageData,{
                id:0,
                roomId:_roomId,
                name:fileReader.result,
                numberOnTheList: isNaN(imageData[imageData.length-1]?.numberOnTheList)? 1 :imageData[imageData.length-1]?.numberOnTheList+1 ,
                added:true,
                url:fileReader.result
                }]
                :
                [{
                    id:0,
                    roomId:_roomId,
                    name:fileReader.result,
                    numberOnTheList:1,
                    added:true,
                    url:fileReader.result
                }]
            )
        }

        SortImageData();
    }

    return (
        <div>
            <span>Название</span>
            <input value={title} onChange={(e)=>setTitle(e.target.value)}></input>

            <table>
                {imageData.map((image, i, arr)=>
                    <tr key={i+"some_string"}>
                        <th>
                            <img style={{height:"200px"}} src={image.url}></img>
                        </th>
                        <th>
                            {(i!==0)&& <button onClick={e=>{
                                imageData[i].numberOnTheList=imageData[i].numberOnTheList-1;
                                imageData[i-1].numberOnTheList++;
                                console.log(imageData[i].numberOnTheList)
                                SortImageData();
                            }}>Вверх</button>}
                            {(i!=imageData.length-1)&&<button onClick={e=>{
                                imageData[i].numberOnTheList++;
                                imageData[i+1].numberOnTheList--;
                                console.log(imageData[i].numberOnTheList)
                                SortImageData();
                            }}>Вниз</button>}
                        </th>
                        <th>
                            <button onClick={e=>{
                                RemoveImageData(i);
                            }}>Удалить</button>
                        </th>
                    </tr>
                ) }
            </table>
            <span>Добавить изображение</span>
            <input type="file" name="myImg" onChange={onChangeIputImage}></input>
            <span>Описание</span>
            <input value={room.description} onChange={(e)=>setDescription(e.target.value)}></input>
            <span>Вместимость/число коек</span>
            <input value={room.capacity} onChange={(e)=>setCapacity(e.target.value)} type="number"></input>
            <span>Цена</span>
            <input value={room.price} onChange={(e)=>setPrice(e.target.value)} type="number"></input>

            <button>{(room!=null)?'Подтвердить изменения':'Создать'}</button>

        </div>
    );
};

export default AdminRoomFullCard;