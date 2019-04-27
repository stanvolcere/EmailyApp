import axios from "axios";
import { FETCH_USER } from './types';
import { FETCH_SURVEYS } from './types';

export const fetchUser = () => 
    // redux thunk will automatically call the returned function with dispatch as arg
    // allows us to treat this as an asynchronous piece of action
    async dispatch => {
        const res = await axios.get("/api/current_user");

        dispatch({ type: FETCH_USER, payload: res.data });
        // es6 refactor up top
};

// whenever FETCH_USER is dispatche the AuthReducer will automatically update the Header which
// want to update with the new credits
export const handleToken = token => async (dispatch) => {

    const res = await axios.post('/api/stripe', token);
    dispatch({ type: FETCH_USER, payload: res.data });
}

export const submitSurvey = (values, history) => async (dispatch) => {
    //return { type: 'SUBMIT_SURVEY' };
    //console.log(values);
    const res = await axios.post('/api/surveys', values);

    history.push('/surveys');
    dispatch({ type: FETCH_USER, payload: res.data });
}

export const fetchSurveys = () => async (dispatch) => {
    const res = await axios.get('/api/surveys');
    dispatch( {type: FETCH_SURVEYS, payload:res.data } );
}