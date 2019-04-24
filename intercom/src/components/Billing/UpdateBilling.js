import React, { Component } from "react";
import axios from 'axios';
import host from '../../host';
import {CardElement, injectStripe} from 'react-stripe-elements'; // The injectStripe HOC provides the this.props.stripe property that manages your Elements groups. You can call this.props.stripe.createToken or this.props.stripe.createSource within a component that has been injected to submit payment data to Stripe.


class UpdateBilling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            last4: '', 
            errorMessage: '',
            processing: false,
            buttonText:'Update'
        }
    }

    createSource = async() => {
        const sourceInfo = {
            type: 'card',
            currency: 'usd',
            usage: 'reusable'
        }
        
        try{
            const createSourceResponse = await this.props.stripe.createSource(sourceInfo);

            if (createSourceResponse.error) {
                this.setState({errorMessage:createSourceResponse.error.message})
            }
            // console.log('createSourceResponse: ', createSourceResponse);
            const source = createSourceResponse.source;
            // console.log('source: ', source);
            return source;
        } catch(err) {
            console.log('err: ', err);
            return err
        }
    }

    // updateDefaultSource = async(source) => {
    //     const userId = localStorage.getItem('userId');

    //     try{
    //         const res = await axios.get(`${host}/api/users/${userId}`);
    //         const userStripeId = res.data.stripeId;
    //         // console.log('userStripeId: ', userStripeId);

    //         const updatedSource = await axios.post(`${host}/api/billing/updateDefaultSource`, {
    //             'userStripeId':userStripeId,
    //             'sourceId': source.id
    //         });
    //         if (updatedSource.error) {
    //             this.setState({errorMessage:updatedSource.error.message})
    //         }
    //         // console.log('updatedSource: ', updatedSource);

    //         const last4 = updatedSource.data.sources.data[0].card.last4;
    //         await axios.put(`${host}/api/users/${userId}/last4`, {last4:last4})
    //         this.props.handleBillingUpdate();
    //         return updatedSource;
    //     } catch(err) {
    //         console.log('err: ', err);
    //         return err
    //     }
    // }

    // updateBilling = async() => {
    //     try{
    //         // Step 1, create a source from the entered credit card information. 
    //         const source = await this.createSource();
            
    //         // Step 2, update the customer's default source. 
    //         // const newDefaultSource = await this.updateDefaultSource(source);
    //         await this.updateDefaultSource(source);

    //         this.props.toggleChangeBilling();

    //     } catch(err) {
    //         console.log('err: ', err)
    //         return err
    //     }
    // }

    updateCreditCard = async() => {
        const userId = localStorage.getItem('userId');
        try{
            this.setState({processing: true, buttonText:'Processing...'})
            const source = await this.createSource();
            // console.log('source: ', source);
            
            const updateCreditCardRes = await axios.post(`${host}/api/billing/updateCreditCard`, {'userId': userId, 'source':source});
            // console.log('updateCreditCardRes: ', updateCreditCardRes);
            this.setState({processing: false, buttonText:'Update'});

            this.props.handleBillingUpdate();
            this.props.toggleChangeBilling();

        } catch(err) {
            console.log('err: ', err)
            return err
        }
    }

    render() {
        return (
            <div>

                <div className='input-group creditcard-div'>
                    <CardElement style={{ padding: "9px !important"}}/>       
                    <span className="input-group-btn">
                        <button 
                            className="btn btn-default" 
                            type="button" 
                            onClick = {this.updateCreditCard}
                            disabled={this.state.last4 === null || this.state.processing === true}
                        >
                            {this.state.buttonText} 
                        </button>
                    </span>                   
                </div>

                <div style = {{marginBottom:'10px', border:'1px solid black', height:'200px'}}>
                    {this.state.errorMessage}
                </div>
                
            </div>
        )
    }
}

export default injectStripe(UpdateBilling);

