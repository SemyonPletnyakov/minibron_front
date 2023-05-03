import React, { useState } from "react";
import ComponentsEnum from "./Common/ComponentsEnum";
import AdditionalServicesMenu from "./components/AdditionalServicesMenu";
import BookingForUser from "./components/BookingForUser";
import DateForm from "./components/DateForm";
import RoomFullCard from "./components/RoomFullCard";
import RoomsMenu from "./components/RoomsMenu";
import './styles/main.css';

function App() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [roomsData, setRoomsData] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState({});
    const [actionComponent, setActionComponent] = useState(ComponentsEnum.DateForm);
    const [selectedServices, setSelectedServices] = useState([]);



    function findRooms(rooms){
      setRoomsData(rooms);
      setActionComponent(ComponentsEnum.RoomsMenu)
    }
    function selectRoom(roomId){
      setSelectedRoom(roomsData.find(item=>item.id==roomId));
      setActionComponent(ComponentsEnum.RoomsFullCard)
    }
    function backToRoomsMenu(){
      setSelectedRoom({});
      setActionComponent(ComponentsEnum.RoomsMenu);
    }
    function goToServices(){
      setActionComponent(ComponentsEnum.AdditionalServices);
    }
    function backToRoom(){
      setSelectedServices([]);
      setActionComponent(ComponentsEnum.RoomsFullCard);
    }
    function goToBooking(){
      setActionComponent(ComponentsEnum.BookingForUser);
    }
    function goToFirstComponent(){
      setActionComponent(ComponentsEnum.DateForm);
    }

    return (
      <div className="App">
        {!(actionComponent==ComponentsEnum.BookingForUser) &&
          <DateForm startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} findRooms={findRooms}/>
        }
        {(actionComponent==ComponentsEnum.RoomsMenu) &&
          <RoomsMenu roomsData={roomsData}  selectRoom = {selectRoom}/>
        }
        {(actionComponent==ComponentsEnum.RoomsFullCard) &&
          <RoomFullCard room={selectedRoom} backToRoomsMenu={backToRoomsMenu} goToServices={goToServices}/>
        }
        {(actionComponent==ComponentsEnum.AdditionalServices) &&
          <AdditionalServicesMenu backToRoom={backToRoom} selectedServices={selectedServices} setSelectedServices={setSelectedServices} goToBooking={goToBooking}/> 
        }
        {(actionComponent==ComponentsEnum.BookingForUser) &&
          <BookingForUser selectedRoom={selectedRoom} selectedService={selectedServices} startDate={startDate} endDate={endDate} goToServices={goToServices} goToFirstComponent={goToFirstComponent}/>
        }
      </div>
    );
}

export default App;
