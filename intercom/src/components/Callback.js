import React, { Component } from 'react';
import auth0Client from './Auth';
import { Spinner } from 'reactstrap';


class Callback extends Component {

    async componentDidMount() {
        await auth0Client.handleAuthentication();

        console.log('callback', this.props);

        if (localStorage.getItem('jwt')) {
            window.location.href = '/'
        }
    }


    /**
     * @TODO Make this a nifty loading wheel or progress bar
     */

    render() {
        return (
            <div className='callback-container'>
                <h1>Loading profile...</h1>
                <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />
            </div>

        );
    }
}


export default Callback;