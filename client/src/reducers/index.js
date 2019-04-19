import {combineReducers} from 'redux';
import authReducer from './authReducer';

// the index.js mostly responsible for the redux set up stuff
export default combineReducers({
    auth: authReducer
});