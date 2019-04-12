import React, { Component } from "react";
import {Elements, StripeProvider} from 'react-stripe-elements';
import UpdateBilling from './UpdateBilling';

class UpdateBillingWrapper extends Component {
    constructor(props) {
        super(props);
    }

    render() { 
        return (
            // StripeProvider initializes Stripe and passes in your publishable key. It’s 
            // equivalent to creating a Stripe instance with Stripe.js.
            <StripeProvider apiKey = 'pk_test_VuIo3fiUe3QUD93ieQbeDT5U00sms1K5SK' betas = {["payment_intent_beta_3"]}>
                {/* <div style = {{border:'1px solid black'}}> */}
                <div>
                    {/* The Elements component, which encloses the UpdateBilling component,
                      creates an Elements group. When you use multiple Elements components
                      instead of the combined CardElement, the Elements group indicates 
                      which ones are related. For example, if you used separate components
                      for the card number, expiration date, and CVC, you would put them 
                      all in the same Elements group. Note that Elements must contain the
                      component that you wrapped with injectStripe, you cannot put Elements
                      inside of the component that you wrap with injectStripe. */}

                    <Elements>
                        <UpdateBilling 
                            handleBillingUpdate = {this.props.handleBillingUpdate}
                        />
                    </Elements>

                </div>               
            </StripeProvider>
        )
    }
}

export default UpdateBillingWrapper;