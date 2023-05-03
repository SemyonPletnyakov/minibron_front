import axios from "axios";
import ServerLink from "./ServerLink";

export default class BookingsRequests{
    static async newBooking(_startDate, _endDate, _fio, _phone, _email, _roomId, _hotelId){
        /*const response = await axios.post(ServerLink.link + '/Bookings', {
            params: {
                hotelId: _hotelId
            },
            body: {
                roomId: _roomId,
                startDateTime: _startDate,
                endDateTime: _endDate,
                fio: _fio,
                phone: _phone,
                email: _email
            }
        })*/
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
        })
        return response.data;
    }
}