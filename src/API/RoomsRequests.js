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
        console.log(response.data)
        return response.data;
    }
    
}