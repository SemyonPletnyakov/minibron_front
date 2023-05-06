import axios from "axios";
import ServerLink from "./ServerLink";

export default class SessionRequests{
       
    static async getAll(_jwt){
        const response = await axios.get(ServerLink.link + '/Sessions/GetAll', {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }

    static async getActual(_jwt){
        const response = await axios.get(ServerLink.link + '/Sessions/GetActual', {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async createSession(_session,  _jwt){
        const response = await axios.post(ServerLink.link + '/Sessions', _session,{
            headers: {
            Authorization: _jwt,
          }
        })
        return response.data;
    }
    static async updateSession(_service, _jwt){
        
        const response = await axios.put(ServerLink.link + '/Sessions', _service,
        {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async deleteSessionById(_service, _jwt){
        const response = await axios.delete(ServerLink.link + '/Sessions', 
        {
            headers: {
            Authorization: _jwt,
          },
          data:_service
        });
        return response.data;
    }

    static async createSessionService(_service, _jwt){
        const response = await axios.post(ServerLink.link + '/Sessions/Service', _service,
        {
            headers: {
            Authorization: _jwt,
          }
        })
        return response.data;
    }
    static async deleteSessionServiceById(_service, _jwt){
        const response = await axios.delete(ServerLink.link + '/Sessions/Service', 
        {
            headers: {
            Authorization: _jwt,
          },
          data:_service
        });
        return response.data;
    }
}