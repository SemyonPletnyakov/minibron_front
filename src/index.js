import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppAdmin from './AppAdmin';

//const root = ReactDOM.createRoot(document.getElementById('root'));
const baseModule = document.querySelector('[id^="hotelId="]')?.id;

let globalHotelId;
if(baseModule != null){
  const root = ReactDOM.createRoot(document.getElementById(document.querySelector('[id^="hotelId="]').id));
  globalHotelId = +(document.querySelector('[id^="hotelId="]').id.substring(8));

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

const adminModule = document.querySelector('[id^="adminHotelId="]')?.id;
export let adminGlobalHotelId;
if(adminModule!=null){
  const root2 = ReactDOM.createRoot(document.getElementById(document.querySelector('[id^="adminHotelId="]').id));
  adminGlobalHotelId = +(document.querySelector('[id^="adminHotelId="]').id.substring(13));
  console.log(adminGlobalHotelId);
  root2.render(
    <React.StrictMode>
      <AppAdmin />
    </React.StrictMode>
  );
}

export default globalHotelId;


