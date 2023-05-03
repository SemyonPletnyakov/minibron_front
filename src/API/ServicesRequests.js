import axios from "axios";
import ServerLink from "./ServerLink";

export default class ServicesRequests{
    static async getAll(_hotelId){
        const response = await axios.get(ServerLink.link + '/AdditionalServices', {
            params: {
                hotelId: _hotelId
            }
        })
        return response.data;
    }
    static getPictureLink(_hotelId,_name){
        return ServerLink.link + '/Pictures?hotelId=' + _hotelId + '&roomId='+ 0+'&name='+_name
    }
    
}