import 'react-app-polyfill/ie11'; // this polyfill needs to be first for IE11 support
import 'babel-polyfill'; // necessary for IE11 support for Router
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './taxonomy-browser.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

function renderTaxonomy(baseUrl, subscriptionKey, divId) {
  ReactDOM.render(
    <HashRouter hashType="noslash">
      <App BASE_URL={baseUrl} API_KEY={subscriptionKey}/>
    </HashRouter>,
    document.getElementById(divId)
  );
}

export default renderTaxonomy;
window.Explorer = {
  renderTaxonomy: renderTaxonomy,
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
