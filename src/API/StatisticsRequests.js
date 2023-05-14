import axios from "axios";
import ServerLink from "./ServerLink";


export default class StatisticsRequests{
    static async getIncome(_startDate,_endDate , _jwt){
        const response = await axios.get(ServerLink.link + '/Statistics/IncomeMonth?startDate='+_startDate+ '&endDate='+_endDate, {
            headers: {
                Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async getCountBookings(_startDate,_endDate , _jwt){
        const response = await axios.get(ServerLink.link + '/Statistics/BookingsMonth?startDate='+_startDate+ '&endDate='+_endDate, {
            headers: {
                Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async getCountBokingsRooms(_startDate,_endDate , _jwt){
        const response = await axios.get(ServerLink.link + '/Statistics/RoomsMonth?startDate='+_startDate+ '&endDate='+_endDate, {
            headers: {
                Authorization: _jwt,
          }
        });
        return response.data;
    }
}