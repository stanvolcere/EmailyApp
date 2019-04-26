import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import formFields from './formFields';
import _ from 'lodash';
import * as actions from '../../actions';


const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
    

    const reviewFields = _.map(formFields, ({ name, label}) => {
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        ) 
    });

    return (
        <div>
            <h3>Please confirm your entries</h3>
            
            {reviewFields}
            <button className='yellow darken-3 white-text btn-flat' onClick={ onCancel }>
                Back
            </button>
            <button className='green darken-1 white-text btn-flat right' onClick={() => submitSurvey(formValues, history)}>
                <i className='material-icons right' >email</i> Send Survey
            </button>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        formValues: state.form.surveyForm.values 
    };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));