import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppAdmin from './AppAdmin';

//const root = ReactDOM.createRoot(document.getElementById('root'));
const root = ReactDOM.createRoot(document.getElementById(document.querySelector('[id^="hotelId="]').id));
const globalHotelId = +(document.querySelector('[id^="hotelId="]').id.substring(8));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const root2 = ReactDOM.createRoot(document.getElementById(document.querySelector('[id^="adminHotelId="]').id));
export const adminGlobalHotelId = +(document.querySelector('[id^="adminHotelId="]').id.substring(13));
console.log(adminGlobalHotelId);
root2.render(
  <React.StrictMode>
    <AppAdmin />
  </React.StrictMode>
);

export default globalHotelId;


