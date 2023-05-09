import axios from "axios";
import ServerLink from "./ServerLink";

export default class BookingsRequests{
    static async newBooking(_startDate, _endDate, _fio, _phone, _email, _roomId, _hotelId){
        const response = await axios.post(ServerLink.link + '/Bookings?hotelId='+ _hotelId, {
            
            roomId: _roomId,
            startDateTime: _startDate,
            endDateTime: _endDate,
            fio: _fio,
            phone: _phone,
            email: _email
        })
        return response.data;
    }
    static async newBookingService(_serviceId, _bookingId, _hotelId){
        const response = await axios.post(ServerLink.link + '/Bookings/Service?hotelId='+ _hotelId, {
            
            bookingId: _bookingId,
            additionalServiceId: _serviceId
        });
        console.log({
            
            bookingId: _bookingId,
            additionalServiceId: _serviceId
        });
        return response.data;
    }
    static async getAll(_jwt){
        const response = await axios.get(ServerLink.link + '/Bookings/GetAll', {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }

    static async getActual(_jwt){
        const response = await axios.get(ServerLink.link + '/Bookings/GetActual', {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    
    static async updateBooking(_booking, _jwt){
        
        const response = await axios.put(ServerLink.link + '/Bookings', _booking,
        {
            headers: {
            Authorization: _jwt,
          }
        });
        return response.data;
    }
    static async deleteBookingByEmailOrPhone(_hotelId,_booking, _jwt){
        const response = await axios.delete(ServerLink.link + '/Bookings?hotelId='+_hotelId, 
        {
            headers: {
            Authorization: _jwt,
          },
          data:_booking
        });
        return response.data;
    }
    static async deleteBookingById(_booking, _jwt){
        const response = await axios.delete(ServerLink.link + '/Bookings/BookingById', 
        {
            headers: {
            Authorization: _jwt,
          },
          data:_booking
        });
        return response.data;
    }
    static async deleteBookingServiceById(_service, _jwt){
        const response = await axios.delete(ServerLink.link + '/Bookings/Service', 
        {
            headers: {
            Authorization: _jwt,
          },
          data:_service
        });
        return response.data;
    }
}