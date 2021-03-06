import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from "redux";


import App from './components/App';
import reducers from './reducers';

// temporary for testing the survey creation route
const axios = require('axios');
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
    <Provider store={store}><App /></Provider>, 
    document.querySelector('#root')
);