import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import globalHotelId from '..';
import RoomsRequests from '../API/RoomsRequests';

const AdminRoomFullCard = ({room, isCreate, setIsCreate, setSelectedRoom}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    
    const[imageData, setImageData] = useState([]);
    const[imageOldData, setImageOldData] = useState([]);

    const[title, setTitle] = useState(!isCreate && room!=null? room.title: "");
    const[description, setDescription] = useState(!isCreate&& room!=null? room.description:"");
    const[capacity, setCapacity] = useState(!isCreate&& room!=null? room.capacity: 0);
    const[price, setPrice] = useState(!isCreate&& room!=null? room.price: 0);
    const [_roomId, setRoomId] = useState(!isCreate&& room!=null? room.id : 0);
    const [newFiles, setNewFiles] = useState([])
    
    async function loadImageData(){      
        const response = await RoomsRequests.getRoomPicturesData(_roomId);
        let t1 = response.sort( (a, b) => a.numberOnTheList - b.numberOnTheList ).map((item)=>(
            {
                id:item.id,
                roomId:item.roomId,
                name:item.name,
                numberOnTheList:item.numberOnTheList,
                added:false,
                url:RoomsRequests.getPictureLink(globalHotelId,_roomId,item.name)
            }))
        let t2 = response.sort( (a, b) => a.numberOnTheList - b.numberOnTheList ).map((item)=>(
            {
                id:item.id,
                roomId:item.roomId,
                name:item.name,
                numberOnTheList:item.numberOnTheList,
                added:false,
                url:RoomsRequests.getPictureLink(globalHotelId,_roomId,item.name)
            }))
        console.log(t1)
        setImageData(t1);
        setImageOldData(t2);
    }

    useEffect(()=>{
        if(!isCreate)
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
                name:e.target.files[0].name,
                numberOnTheList: isNaN(imageData[imageData.length-1]?.numberOnTheList)? 1 :imageData[imageData.length-1]?.numberOnTheList+1 ,
                added:true,
                url:fileReader.result
                }]
                :
                [{
                    id:0,
                    roomId:_roomId,
                    name:e.target.files[0].name,
                    numberOnTheList:1,
                    added:true,
                    url:fileReader.result
                }]
            )
            setNewFiles([...newFiles,e.target.files[0]])
        }

        SortImageData();
    }
    async function submitOnClick(e){
        if(room!==null){
            let response;
            if(!isCreate){
                response = await RoomsRequests.updateRoom({
                    id:_roomId,
                    title:title,
                    description:description,
                    capacity:capacity,
                    price:price,
                    pictureName:imageData[0]?.name
                },cookies?.token);
                if(response){
                    await RoomsRequests.updateRoomPicturesData(imageData.map(item=>({
                        id:item.id,
                        roomId:_roomId,
                        name: item.name,
                        numberOnTheList:item.numberOnTheList
                    })),cookies?.token);
                    //await RoomsRequests.createPictures(imageData.filter(item=>item.added).map(item=>(item.url)),_roomId,cookies?.token)
                    const formData = new FormData();
                    /*newFiles.forEach(function(item, index, array) {
                        formData.append(item.name, item);
                      });*/
                      console.log(newFiles);
                      for (let i = 0; i < newFiles.length; i++) {
                        formData.append("images", newFiles[i]);
                      }
                      for (var key of formData.entries()) {
                        console.log(key[0] + ', ' + key[1]);
                        }
                      //console.log(formData.entries());
                      //console.log(formData.getHeaders())
                    await RoomsRequests.createPictures(formData,_roomId,cookies?.token)
                }
            }
            else{
                response = await RoomsRequests.createRoom({
                    title:title,
                    description:description,
                    capacity:capacity,
                    price:price,
                    pictureName:imageData[0]?.name
                },cookies?.token);
                if(response){
                    await RoomsRequests.updateRoomPicturesData(imageData.map(item=>({
                        id:item.id,
                        roomId:response,
                        name: item.name,
                        numberOnTheList:item.numberOnTheList
                    })),cookies?.token);

                    const formData = new FormData();
                      console.log(newFiles);
                      for (let i = 0; i < newFiles.length; i++) {
                        formData.append("images", newFiles[i]);
                      }
                      for (var key of formData.entries()) {
                        console.log(key[0] + ', ' + key[1]);
                        }
                    await RoomsRequests.createPictures(formData,response,cookies?.token)
                    setIsCreate(false);
                    setRoomId(response);
                    setSelectedRoom(response);
                }
            }

            
        }


    }
    async function onClickDeleteButton(e){
        await RoomsRequests.deleteRoom({id:_roomId},cookies?.token);
        setIsCreate(false);
        setSelectedRoom(0);
    }
    

    return (
        <div>
            <span>Название</span>
            <input value={title} onChange={(e)=>setTitle(e.target.value)}></input>

            <table>
                {imageData.map((image, i, arr)=>
                    <tr key={i+"some_string"}>
                        <th>
                            <img style={{height:"200px"}} src={image.url} alt={image.name}></img>
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
            <input type="file" onChange={onChangeIputImage}></input>
            <span>Описание</span>
            <input value={description} onChange={(e)=>setDescription(e.target.value)}></input>
            <span>Вместимость/число коек</span>
            <input value={capacity} onChange={(e)=>setCapacity(e.target.value)} type="number"></input>
            <span>Цена</span>
            <input value={price} onChange={(e)=>setPrice(e.target.value)} type="number"></input>

            <button onClick={submitOnClick}>{(room!=null)?'Подтвердить изменения':'Создать'}</button>
            {!isCreate&& <button onClick={onClickDeleteButton}>Удалить</button>}
            <button onClick={e=>{setIsCreate(false); setSelectedRoom(0)}}>Отмена</button>

        </div>
    );
};

export default AdminRoomFullCard;