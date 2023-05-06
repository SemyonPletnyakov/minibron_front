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
    static async changeYourAcc(_newAccData, _jwt){
        const response = await axios.put(ServerLink.link + '/Account',_newAccData, {
            headers: {
            Authorization: _jwt,
          }
        });
        return response;
    }

    static async getAllUsers(_jwt){
        const response = await axios.get(ServerLink.link + '/Users/GetAll', {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async createUser(_user,_jwt){
        const response = await axios.post(ServerLink.link + '/Users',_user, {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async changeUser(_user,_jwt){
        const response = await axios.put(ServerLink.link + '/Users',_user, {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async deleteUser(_user, _jwt){
        const response = await axios.delete(ServerLink.link + '/Users', 
        {
            headers: {
            Authorization: _jwt,
          },
          data:_user
        });
        return response.data;
    }
}