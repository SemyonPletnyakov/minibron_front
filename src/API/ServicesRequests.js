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


    static async createService(_service, _jwt){
        const response = await axios.post(ServerLink.link + '/AdditionalServices', _service,
        {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async updateService(_service, _jwt){
        
        const response = await axios.put(ServerLink.link + '/AdditionalServices', _service,
        {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async deleteService(_service, _jwt){
        const response = await axios.delete(ServerLink.link + '/AdditionalServices', 
        {
            headers: {
            Authorization: _jwt,
          },
          data:_service
        });
        return response.data;
    }

    static async createPictures(_masPictures, _jwt){
        //console.log('Хедеры')
        //console.log(_masPictures.getHeaders())

        const response = await axios.post(ServerLink.link + '/Pictures/SomeImages?roomId='+0, _masPictures,
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