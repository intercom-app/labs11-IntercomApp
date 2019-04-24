import React, { Component } from "react";
import axios from 'axios';
import host from '../../host';
// import {CardElement, injectStripe} from 'react-stripe-elements'; // The injectStripe HOC provides the this.props.stripe property that manages your Elements groups. You can call this.props.stripe.createToken or this.props.stripe.createSource within a component that has been injected to submit payment data to Stripe.
import {injectStripe} from 'react-stripe-elements'; // The injectStripe HOC provides the this.props.stripe property that manages your Elements groups. You can call this.props.stripe.createToken or this.props.stripe.createSource within a component that has been injected to submit payment data to Stripe.

// The CardElement component imported from react-stripe-elements creates a “card” type element
// that mounts on the page when the component renders. The CardElement includes inputs for all
// of the major card fields: the card number, the expiration date, and the CVC. To display 
// those inputs separately, you can use other Element components provided by the library.

class AddToBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountToAdd:0,
            errorMessage: '',
            processing: false,
            buttonText:'Add'
        };
    }

    inputChangeHandler = e => {
        e.preventDefault();
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    // chargeAndAddToBalance = async(e) => {
    //     e.preventDefault();

    //     const userId = localStorage.getItem('userId');
    //     // console.log('userId: ', userId);
    //     try {
    //         const res = await axios.get(`${host}/api/users/${userId}`);
    //         const userStripeId = res.data.stripeId;
    //         // console.log('userStripeId: ', userStripeId);

    //         const customerStripeInfo = await axios.post(`${host}/api/billing/retrieveCustomerDefaultSource`,{'userStripeId':userStripeId});
    //         // console.log('customerStripeInfo: ', customerStripeInfo);
    //         const defaultSourceId = customerStripeInfo.data.defaultSourceId;
    //         // console.log('defaultSourceId: ', defaultSourceId);

    //         // TESTING - Soon to be phased out (but working) credit card charging method
    //         const chargeResponse = await axios.post(`${host}/api/billing/createCharge`, {
    //             'userStripeId':userStripeId,
    //             'sourceId': defaultSourceId,
    //             'amountToAdd': this.state.amountToAdd*100
    //         })
    //         // if (chargeResponse.error) {
    //         //     this.setState({errorMessage:chargeResponse.error.message})
    //         // }
    //         // console.log('chargeResponse: ', chargeResponse);
    //         // console.log('chargeResponse: ', chargeResponse.data);

    //         if (chargeResponse.data.type === "StripeInvalidRequestError") {
    //             console.log('errorMessage: ',chargeResponse.data.message)
    //             this.setState({errorMessage:chargeResponse.data.message})
    //         } 

    //         // if (chargeResponse.data.errorMessage) {
    //         //     console.log('errorMessage: ',chargeResponse.data.message)
    //         //     this.setState({errorMessage:chargeResponse.data.message})
    //         // }
            
    //         if (chargeResponse.data.charge.status === "succeeded") {
    //             // console.log('charge succeeded!');

    //             // // // // ORIGINAL APPROACH
    //             // const accountBalanceCall = await axios.get(`${host}/api/users/${userId}/accountBalance`);
    //             // let accountBalance = accountBalanceCall.data.accountBalance;
    //             // // console.log('accountBalance old: ', accountBalance);
    //             // accountBalance = accountBalance + chargeResponse.data.charge.amount;
    //             // // console.log('accountBalance new: ', accountBalance);  

    //             // // const addToBalanceResponse = await axios.put(`${host}/api/users/${userId}/accountBalance`, {accountBalance:accountBalance});
    //             // await axios.put(`${host}/api/users/${userId}/accountBalance`, {accountBalance:accountBalance});
    //             // // console.log('addToBalanceResponse: ', addToBalanceResponse);
                
    //             this.props.updateUserAccountBalance()
    //             this.setState({amountToAdd:0})
    //             this.props.toggleChangeAddToBalance()
    //             this.props.handleAddToBalance();
    //         } else {
    //             console.log('else')
    //             this.setState({errorMessage:chargeResponse.data.message})
    //         }


    //     } catch(err) {
    //         console.log('err: ', err);
    //         return err
    //     }
    // }

    chargeCreditCardAndUpdateAccountBalance = async(req,res) => {
        const userId = localStorage.getItem('userId');
        console.log('userId: ', userId);
        try{
            // this.setState({processing: true, buttonText:'Processing...'})
            // // the body sent to the /api/billing/addMoneyIOS endpoint should contain entries for userId and amountToAdd
            // const amountToAdd = this.state.amountToAdd // in dollars
            // const addMoneyIOSRes = await axios.post(`${host}/api/billing/addMoney`,{'userId':userId, 'amountToAdd':amountToAdd});
            // // console.log('addMoneyIOSRes: ', addMoneyIOSRes);

            // if (addMoneyIOSRes.data.errorMessage) {
            //     // console.log('errorMessage: ',addMoneyIOSRes.data.errorMessage);
            //     this.setState({errorMessage:addMoneyIOSRes.data.errorMessage});
            //     console.log('this.state.errorMessage: ',this.state.errorMessage )
            // };

            // const updatedAccountBalance = addMoneyIOSRes.data.updatedAccountBalance;
            // console.log('updatedAccountBalance: ', updatedAccountBalance);

            // this.setState({amountToAdd:0, processing: false, buttonText:'Add'});
            // this.props.toggleChangeAddToBalance();
            // this.props.handleAddToBalance();

            this.setState({processing: true, buttonText:'Processing...'})
            // the body sent to the /api/billing/addMoneyIOS endpoint should contain entries for userId and amountToAdd
            const amountToAdd = this.state.amountToAdd // in dollars
            const addMoneyIOSRes = await axios.post(`${host}/api/billing/addMoney`,{'userId':userId, 'amountToAdd':amountToAdd});
            // console.log('addMoneyIOSRes: ', addMoneyIOSRes);

            if (addMoneyIOSRes.data.errorMessage) {
                // console.log('errorMessage: ',addMoneyIOSRes.data.errorMessage);
                this.setState({errorMessage:addMoneyIOSRes.data.errorMessage});
                // console.log('this.state.errorMessage: ',this.state.errorMessage )
            } else{
                const updatedAccountBalance = addMoneyIOSRes.data.updatedAccountBalance;
                // console.log('updatedAccountBalance: ', updatedAccountBalance);

                this.setState({amountToAdd:0, processing: false, buttonText:'Add'});
                this.props.toggleChangeAddToBalance();
                this.props.handleAddToBalance();
            };

            

        } catch(err) {
            console.log('err: ', err);
            return err
        }
    }   


    render() {
        return (
            <div>

                <div className="input-group add-balance-div">
                    <input
                        placeholder='Amount to add: $'
                        type = 'number'
                        name = 'amountToAdd'
                        value = {this.state.amountToAdd}
                        onChange = {this.inputChangeHandler}
                        className='form-control add-balance-input'
                    />
                    <span className="input-group-btn">
                        <button 
                            className="btn btn-default" 
                            onClick = {this.chargeCreditCardAndUpdateAccountBalance} 
                            type = 'submit'
                            disabled={this.state.amountToAdd === 0 || this.state.processing === true}
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


// The injectStripe HOC provides the this.props.stripe property that manages your Elements groups. You can call this.props.stripe.createToken or this.props.stripe.createSource within a component that has been injected to submit payment data to Stripe.
export default injectStripe(AddToBalance);
























// chargeCustomer = async(e) => {
//     e.preventDefault();
//     const userId = localStorage.getItem('userId');
//     // console.log('userId: ', userId);

//     try {
//         const res = await axios.get(`${host}/api/users/${userId}`);
//         const userStripeId = res.data.stripeId;
//         // console.log('userStripeId: ', userStripeId);
//         const customerStripeInfo = await axios.post(`${host}/api/billing/retrieveCustomerDefaultSource`,{'userStripeId':userStripeId});
//         // console.log('customerStripeInfo: ', customerStripeInfo);
//         const defaultSourceId = customerStripeInfo.data.defaultSourceId;
//         // console.log('defaultSourceId: ', defaultSourceId);

//         // TESTING - Soon to be phased out (but working) credit card charging method
//         const chargeResponse = await axios.post(`${host}/api/billing/createCharge`, {
//             'userStripeId':userStripeId,
//             'sourceId': defaultSourceId,
//             'amountToAdd': this.state.amountToAdd 
//         })
//         console.log('chargeResponse: ', chargeResponse);

//         if (chargeResponse.data.charge.status === "succeeded") {
//             // console.log('charge suceeded!');
//             return chargeResponse.data.charge.amount //returns charge amount
//         }

//     } catch(err) {
//         // console.log('err: ', err);
//         return err
//     }
// }

// addToBalance = async(userId, amountToAdd) => {
//     try {
//         const accountBalanceCall = await axios.get(`${host}/api/users/${userId}/accountBalance`);
//         let accountBalance = accountBalanceCall.data.accountBalance;
//         // console.log('accountBalance old: ', accountBalance);
//         accountBalance = accountBalance + chargeResponse.data.charge.amount;
//         // console.log('accountBalance new: ', accountBalance);

//         // const addToBalanceResponse = await axios.put(`${host}/api/users/${userId}/accountBalance`, {accountBalance:accountBalance});
//         await axios.put(`${host}/api/users/${userId}/accountBalance`, {accountBalance:accountBalance});
//         // console.log('addToBalanceResponse: ', addToBalanceResponse);
        

//     } catch(err) {
//         // console.log('err: ', err);
//         return err
//     }
// }