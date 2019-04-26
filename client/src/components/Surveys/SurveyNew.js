import React, {Component } from 'react';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyReviewForm';

import { reduxForm } from 'redux-form';

class SurveyNew extends Component {

    // this is a compomemt leve state that allows us to decide if we should show the review form or not
    state = { showFormReview: false };

    // decides which to show depending on the if we should show review or blank survey form
    renderContent() {
        //console.log(event);

        if (this.state.showFormReview) {
            return <SurveyFormReview 
                // will flip the show form boolean back to false when the user clicks on 'Back'
                onCancel={() => this.setState({ showFormReview: false })}
            />
        } 
        return <SurveyForm onSurveySubmit={() => this.setState({ showFormReview: true })}/>
            // will send the user to the review form page 
    }

    render() {

        return (
            <div>
                {this.renderContent()}
            </div>
        );
    }
}

// tells reduxForm the keep the values of form as 'surveyForm' which clears the form when we
// navaigate away from the Survey Form (except for)
export default reduxForm({
    form: 'surveyForm'}
)(SurveyNew);