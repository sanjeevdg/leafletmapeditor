import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import Map2 from './Map2'; // working leaflet viewer

import EditableMap  from './EditableMap';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
 <EditableMap />
  </React.StrictMode>
);


//http://localhost:3001/tiles/{z}/{x}/{y}.pbf
// b59pIgoNGnhNHBDuQlry
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

/*

 listUrl={'http://localhost:3001/api/features'}
  saveUrl={'http://localhost:3001/api/features'}
  deleteUrl={`http://localhost:3001/features`}

  postgisTileUrl={'http://localhost:3001/tiles/{z}/{x}/{y}.pbf'}
  center = {[21.1458, 79.0882]} 
  zoom = {8}  

  listUrl={'http://localhost:3001/api/features'}
  saveUrl={'http://localhost:3001/api/features'}
  deleteUrl={(id) => `http://localhost:3001/features/${id}`}


*/


reportWebVitals();
