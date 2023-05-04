import axios from "axios";
import ServerLink from "./ServerLink";

export default class AccountRequests{
    static async Login(_login, _password, _hotelId){
        const response = await axios.post(ServerLink.link + '/Account', {
            
            login: _login,
            password: _password,
            hotelId: _hotelId
            
        });
        return response;
    }
    static async getAccInfo(_jwt){
        const response = await axios.get(ServerLink.link + '/Account', {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
}