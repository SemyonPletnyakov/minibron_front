import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import globalHotelId from '..';
import RoomsRequests from '../API/RoomsRequests';

const AdminRoomFullCard = ({room, isCreate, setIsCreate, setSelectedRoom, jwt}) => {
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
                },jwt);
                if(response){
                    await RoomsRequests.updateRoomPicturesData(imageData.map(item=>({
                        id:item.id,
                        roomId:_roomId,
                        name: item.name,
                        numberOnTheList:item.numberOnTheList
                    })),jwt);
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
                    await RoomsRequests.createPictures(formData,_roomId,jwt)
                }
            }
            else{
                response = await RoomsRequests.createRoom({
                    title:title,
                    description:description,
                    capacity:capacity,
                    price:price,
                    pictureName:imageData[0]?.name
                },jwt);
                if(response){
                    await RoomsRequests.updateRoomPicturesData(imageData.map(item=>({
                        id:item.id,
                        roomId:response,
                        name: item.name,
                        numberOnTheList:item.numberOnTheList
                    })),jwt);

                    const formData = new FormData();
                      console.log(newFiles);
                      for (let i = 0; i < newFiles.length; i++) {
                        formData.append("images", newFiles[i]);
                      }
                      for (var key of formData.entries()) {
                        console.log(key[0] + ', ' + key[1]);
                        }
                    await RoomsRequests.createPictures(formData,response,jwt)
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
        <div className='admin_room_menu'>
            <div className='margin_bottom'>
                <span>Название номера</span>
                <input className="text-field__input2" value={title} onChange={(e)=>setTitle(e.target.value)}></input>
            </div>
            <div className='admin_fullroom_img_mas'>
                {imageData.length>0&&<span>Изображения и их порядок:</span>}
                <table>
                    {imageData.map((image, i, arr)=>
                        <tr key={i+"some_string"}>
                            <th>
                                <img className='admin_fullroom_img' src={image.url} alt={image.name}></img>
                            </th>
                            <th>
                                <div className='admin_fullroom_img_button'>
                                {(i!==0)&& <div className='admin_fullroom_img_button'><button className="button_common" onClick={e=>{
                                    imageData[i].numberOnTheList=imageData[i].numberOnTheList-1;
                                    imageData[i-1].numberOnTheList++;
                                    SortImageData();
                                }}>Вверх</button></div>}
                                {(i!=imageData.length-1)&&<div className='admin_fullroom_img_button'><button className="button_common" onClick={e=>{
                                    imageData[i].numberOnTheList++;
                                    imageData[i+1].numberOnTheList--;
                                    SortImageData();
                                }}>Вниз </button></div>}
                                </div>
                            </th>
                            <th>
                                <button className="button_delete" onClick={e=>{
                                    RemoveImageData(i);
                                }}>Удалить</button>
                            </th>
                        </tr>
                    ) }
                </table>
                <span>Добавить изображение: </span>
                <input type="file" onChange={onChangeIputImage}></input>
            </div>
            <div className='margin_bottom'>
                <span>Описание</span>
                <textarea className="text-field__input3" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
            </div>
            <div className='margin_bottom'>
                <span>Вместимость/число коек</span>
                <input name="postContent" className="text-field__input" value={capacity} onChange={(e)=>setCapacity(e.target.value)} type="number"></input>
            </div>
            <div className='margin_bottom'>
                <span>Цена</span>
                <input className="text-field__input" value={price} onChange={(e)=>setPrice(e.target.value)} type="number"></input>
            </div>
            <div className='row_button'>
                <button className="button_add" onClick={submitOnClick}>{(room!=null)?'Подтвердить изменения':'Создать'}</button>
                {!isCreate&& <button className="button_delete" onClick={onClickDeleteButton}>Удалить</button>}
                <button className="button_common" onClick={e=>{setIsCreate(false); setSelectedRoom(0)}}>Отмена</button>
            </div>

        </div>
    );
};

export default AdminRoomFullCard;