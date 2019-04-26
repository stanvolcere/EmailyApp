import React, {Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';
import {Link} from 'react-router-dom';

import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';


// Field component allows for rendering any html element 
class SurveyForm extends Component {
    
    // helper function for isolation of functionality 
    renderFields() {
        return _.map(formFields,  ({ label, name }) => {
            // the key property has to be consistent across renders
            return (<Field key={name} component={SurveyField} type='text' name= { name } label= {label}/>);
        });
    }

    // // placing the () will call the function the instant the interpreter passes over the function
    render() {
        return (
            <div>
            
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}> 
                    
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat white-text">
                        Cancel <i className="material-icons right">cancel</i>
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text">Next
                    <i className="material-icons right">done</i>
                    </button>
                </form>
            </div>
        );
    }
}

// values here holds all the values from our submitted form
function validate(values) {
    // if redux form sees that the errors object has any properties then 
    // redux form will know that their is an error in the details submitted
    const errors = {};

    // if (!values.title) {
    //     // reduxForm will automativally match up the specific error returned to the 
    //     // field in the form
    //     errors.title = "You must provide a title";
    // }
    errors.recipients = validateEmails(values.recipients || "");


    _.each(formFields, ({ name }) => {
        if (!values[name]) {
            errors[name] = `You must provide a value`;
        }
    });

    
    return errors;
}

// notice the similarity to the connect function

export default reduxForm({
    validate,
    // tells redux form to dump the values previpously added to the fields
    destroyOnUnmount: false,
    // this tells redux how to store this form in the store
    form: 'surveyForm'
})(SurveyForm);