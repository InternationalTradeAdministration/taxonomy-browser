import 'react-app-polyfill/ie11';
import 'babel-polyfill'; // necessary for IE11 support for Router
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './style.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
 
const API_KEY = "ShCzzrAkXLpMTsTlhFhUjD29";

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App API_KEY={API_KEY}/>
  </BrowserRouter>,
  document.getElementById('taxonomy_container')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
