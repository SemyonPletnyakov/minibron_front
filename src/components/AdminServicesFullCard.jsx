import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import globalHotelId from '..';
import ServicesRequests from '../API/ServicesRequests';

const AdminServicesFullCard = ({service, isCreate,setIsCreate, setSelectedService}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    

    const[title, setTitle] = useState(!isCreate && service!=null? service.title: "");
    const[description, setDescription] = useState(!isCreate&& service!=null? service.description:"");
    const[price, setPrice] = useState(!isCreate&& service!=null? service.price: 0);
    const [_serviceId, setServiceId] = useState(!isCreate&& service!=null? service.id : 0);
    const [imageSrc, setImageSrc] = useState(!isCreate&& service!=null? ServicesRequests.getPictureLink(globalHotelId,service.pictureName) : "");
    const [imageName, setImageName] = useState(!isCreate&& service!=null? service.pictureName : "");
    const [newFiles, setNewFiles] = useState([])

    function onChangeIputImage(e){
        if (!e.target.files.length) {
            return;
        }
        if (!FileReader) {
            return;
        }

        let fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => {
            setNewFiles([e.target.files[0]]);
            setImageName(e.target.files[0].name);
            setImageSrc(fileReader.result);
        }

    }
    async function submitOnClick(e){
        
        let response;
        if(!isCreate){
            response = await ServicesRequests.updateService({
                id:_serviceId,
                title:title,
                description:description,
                price:price,
                pictureName:imageName
            },cookies?.token);
            if(response && newFiles.length!=0){
                const formData = new FormData();
                for (let i = 0; i < newFiles.length; i++) {
                formData.append("images", newFiles[i]);
                }
                await ServicesRequests.createPictures(formData,cookies?.token)
            }
        }
        else{
            console.log({
                title:title,
                description:description,
                price:price,
                pictureName:imageName
            })
            response = await ServicesRequests.createService({
                title:title,
                description:description,
                price:price,
                pictureName:imageName
            },cookies?.token);
            if(response && newFiles.length!=0){
                const formData = new FormData();
                for (let i = 0; i < newFiles.length; i++) {
                formData.append("images", newFiles[i]);
                }
                await ServicesRequests.createPictures(formData,cookies?.token)
                setIsCreate(false);
                setServiceId(response);
                setSelectedService(response);
            }
        }
         
    }

    async function onClickDeleteButton(e){
        await ServicesRequests.deleteService({id:_serviceId},cookies?.token);
        setIsCreate(false);
        setSelectedService(0);
    }


    return (
        <div>
            <span>Название</span>
            <input value={title} onChange={(e)=>setTitle(e.target.value)}></input>
            {imageName!=""&&
            <table>
                <tr>
                    <th>
                        <img style={{height:"200px"}} src={imageSrc} alt={imageName}></img>
                    </th>
                    <th>
                        <button onClick={e=>{
                            setNewFiles([]);
                            setImageName("");
                        }}>Удалить</button>
                    </th>
                </tr>
            </table>
            }
            <span>{imageName=="" ? "Добавить" : "Изменить"} изображение</span>
            <input type="file" onChange={onChangeIputImage}></input>
            <span>Описание</span>
            <input value={description} onChange={(e)=>setDescription(e.target.value)}></input>
            <span>Цена</span>
            <input value={price} onChange={(e)=>setPrice(e.target.value)} type="number"></input>

            <button onClick={submitOnClick}>{(service!=null)?'Подтвердить изменения':'Создать'}</button>
            {!isCreate&& <button onClick={onClickDeleteButton}>Удалить</button>}
            <button onClick={e=>{setIsCreate(false); setSelectedService(0)}}>Отмена</button>

        </div>
    );
};

export default AdminServicesFullCard;