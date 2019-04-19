import React, {Component} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

// remember the amount is denoted in cents -> 5 dollars is 500 cents
class Payments extends Component {
    render() {
        return (
            <StripeCheckout 
                name='Emaily'
                description="5 Dollars for 5 Email Credits"
                amount={500} 
                token={token => this.props.handleToken(token)}
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
            >
                <button className="btn">Add Credits</button>
            </StripeCheckout>
        )
    };
}

export default connect(null, actions)(Payments);