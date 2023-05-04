import axios from "axios";
import ServerLink from "./ServerLink";

export default class RoomsRequests{
    static async getActual(_startDate, _endDate, _capasity, _hotelId){
        const response = await axios.get(ServerLink.link + '/Rooms', {
            params: {
                startDate: _startDate,
                endDate: _endDate,
                capasity: _capasity,
                hotelId: _hotelId,
            }
        })
        return response.data;
    }
    static async getRoomPicturesData(_roomId){
        const response = await axios.get(ServerLink.link + '/Pictures/GetData', {
            params: {
                roomId: _roomId
            }
        })
        return response.data;
    }
    static getPictureLink(_hotelId,_roomId,_name){
        return ServerLink.link + '/Pictures?hotelId=' + _hotelId + '&roomId='+ _roomId+'&name='+_name
    }
    static async getAllRooms(_jwt){
        const response = await axios.get(ServerLink.link + '/Rooms/GetAll', {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async createRoom(_room, _jwt){
        const response = await axios.post(ServerLink.link + '/Rooms', _room,
        {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async updateRoom(_room, _jwt){
        
        const response = await axios.put(ServerLink.link + '/Rooms', _room,
        {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async deleteRoom(_room, _jwt){
        console.log(_room)
        console.log(_jwt)
        const response = await axios.delete(ServerLink.link + '/Rooms', 
        {
            headers: {
            Authorization: _jwt,
          },
          data:_room
        });
        return response.data;
    }




    static async updateRoomPicturesData(_picturesData, _jwt){
        const response = await axios.put(ServerLink.link + '/Pictures/SetData', _picturesData,
        {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async createPictures(_masPictures, _roomId, _jwt){
        //console.log('Хедеры')
        //console.log(_masPictures.getHeaders())

        const response = await axios.post(ServerLink.link + '/Pictures/SomeImages?roomId='+_roomId, _masPictures,
        {
            headers: {
            Authorization: _jwt,
            'Accept': '*/*',
            "Content-Type": "multipart/form-data",
            //..._masPictures.getHeaders()
          }
        });
        /*const response = await fetch(ServerLink.link + '/Pictures/SomeImages?roomId='+_roomId,
        { 
            method: "POST",
            body: _masPictures,
        });*/
        
        //console.log(response.request)
        //console.log(response.request.headers)
        return response.data;
    }
}