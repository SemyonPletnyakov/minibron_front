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
        <div className='admin_room_menu'>
            <div className='margin_bottom'>
                <span>Название услуги</span>
                <input className="text-field__input2" value={title} onChange={(e)=>setTitle(e.target.value)}></input>
            </div>
            {imageName!=""&&
            <div className='admin_fullroom_img_mas'>
                <span>Изображение</span>
                <table>
                    <tr>
                        <th>
                            <img className='admin_fullroom_img' src={imageSrc} alt={imageName}></img>
                        </th>
                        <th>
                            <button className="button_delete" onClick={e=>{
                                setNewFiles([]);
                                setImageName("");
                            }}>Удалить</button>
                        </th>
                    </tr>
                </table>
            </div>
            }
            <span>{imageName=="" ? "Добавить" : "Изменить"} изображение</span>
                <input type="file" onChange={onChangeIputImage}></input>
            <div className='margin_bottom'>
                <span>Описание</span>
                <textarea className="text-field__input3" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
            </div>
            <div className='margin_bottom'>
                <span>Цена</span>
                <input className="text-field__input" value={price} onChange={(e)=>setPrice(e.target.value)} type="number"></input>
            </div>
            <div className='row_button'>
                <button className="button_add" onClick={submitOnClick}>{(service!=null)?'Подтвердить изменения':'Создать'}</button>
                {!isCreate&& <button className="button_delete" onClick={onClickDeleteButton}>Удалить</button>}
                <button className="button_common" onClick={e=>{setIsCreate(false); setSelectedService(0)}}>Отмена</button>
            </div>

        </div>
    );
};

export default AdminServicesFullCard;